from pathlib import Path
import re

p = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = p.read_text()

# 1) Replace early ProfileActivity title click with type-aware click
# Pattern: openPeerProfile lambda or tvTitle.setOnClickListener { profileIntent...}

old_open_peer = re.search(
    r'val openPeerProfile = View\.OnClickListener \{[\s\S]*?startActivity\(profileIntent\)\s*\}\s*'
    r'tvTitle\.setOnClickListener\(openPeerProfile\)\s*'
    r'(?:findViewById<View\?>\(R\.id\.ivPeerAvatar\)\?\.setOnClickListener\(openPeerProfile\)\s*)?'
    r'(?:findViewById<View\?>\(R\.id\.tvPeerAvatar\)\?\.setOnClickListener\(openPeerProfile\)\s*)?',
    t,
)

replacement = '''val openHeaderClick = View.OnClickListener {
            if (chatType == "channel" || chatType == "group") {
                if (isAdmin) showChannelSettingsDialog() else showChannelMembers()
            } else {
                val profileIntent = android.content.Intent(this, ProfileActivity::class.java)
                profileIntent.putExtra("name", chatTitle)
                val peer = otherUserId ?: peerUid
                if (peer != null) {
                    profileIntent.putExtra("uid", peer)
                    profileIntent.putExtra("userId", peer)
                }
                startActivity(profileIntent)
            }
        }
        tvTitle.setOnClickListener(openHeaderClick)
        findViewById<View?>(R.id.ivPeerAvatar)?.setOnClickListener(openHeaderClick)
        findViewById<View?>(R.id.tvPeerAvatar)?.setOnClickListener(openHeaderClick)
'''

if old_open_peer:
    t = t[:old_open_peer.start()] + replacement + t[old_open_peer.end():]
    print("replaced openPeerProfile block")
else:
    # simpler: tvTitle.setOnClickListener { profileIntent...}
    m = re.search(
        r'tvTitle\.setOnClickListener\s*\{[\s\S]*?ProfileActivity::class\.java[\s\S]*?startActivity\(profileIntent\)\s*\}',
        t,
    )
    if m:
        t = t[:m.start()] + '''tvTitle.setOnClickListener {
            if (chatType == "channel" || chatType == "group") {
                if (isAdmin) {
                    if (::showChannelSettingsDialog.isInitialized) {
                    }
                    try { showChannelSettingsDialog() } catch (_: Exception) { showChannelMembers() }
                } else {
                    try { showChannelMembers() } catch (_: Exception) {}
                }
            } else {
                val profileIntent = android.content.Intent(this, ProfileActivity::class.java)
                profileIntent.putExtra("name", chatTitle)
                val peer = try { otherUserId } catch (_: Exception) { null } ?: try { peerUid } catch (_: Exception) { null }
                if (peer != null) {
                    profileIntent.putExtra("uid", peer)
                    profileIntent.putExtra("userId", peer)
                }
                startActivity(profileIntent)
            }
        }''' + t[m.end():]
        print("replaced tvTitle profile block")
    else:
        print("NO_TITLE_CLICK_PATTERN")

# Remove invalid isInitialized on function - fix if we used it
t = t.replace(
    '''                if (isAdmin) {
                    if (::showChannelSettingsDialog.isInitialized) {
                    }
                    try { showChannelSettingsDialog() } catch (_: Exception) { showChannelMembers() }
                } else {
                    try { showChannelMembers() } catch (_: Exception) {}
                }''',
    '''                if (isAdmin) showChannelSettingsDialog() else showChannelMembers()'''
)

# Ensure showChannelSettingsDialog exists - if not, add minimal stub that doesn't open profile
if "fun showChannelSettingsDialog" not in t:
    fn = r'''
    private fun showChannelSettingsDialog() {
        // Channel settings — NOT own profile
        val view = layoutInflater.inflate(R.layout.dialog_channel_settings, null)
        val etName = view.findViewById<android.widget.EditText>(R.id.etEditChannelName)
        val etDesc = view.findViewById<android.widget.EditText>(R.id.etEditChannelDesc)
        etName?.setText(chatTitle)
        etDesc?.setText(channelDescription ?: "")
        view.findViewById<android.widget.TextView>(R.id.tvShareChannel)?.setOnClickListener {
            val text = getString(R.string.share_channel_text, chatTitle, chatId)
            val i = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(android.content.Intent.EXTRA_TEXT, text)
            }
            startActivity(android.content.Intent.createChooser(i, getString(R.string.share_channel)))
        }
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(R.string.channel_settings)
            .setView(view)
            .setPositiveButton(R.string.save) { _, _ ->
                val newName = etName?.text?.toString()?.trim().orEmpty()
                val newDesc = etDesc?.text?.toString()?.trim().orEmpty()
                if (newName.isNotEmpty()) {
                    chatRef.set(
                        mapOf("name" to newName, "description" to newDesc),
                        com.google.firebase.firestore.SetOptions.merge()
                    )
                    chatTitle = newName
                    findViewById<TextView>(R.id.tvChatTitle).text = newName
                }
            }
            .setNeutralButton(R.string.channel_members_short) { _, _ -> showChannelMembers() }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }
'''
    # only if dialog layout may exist - otherwise simple alert
    if "dialog_channel_settings" not in Path("app/src/main/res/layout").read_text() if False else True:
        pass
    idx = t.rfind("\n}")
    t = t[:idx] + fn + t[idx:]
    print("added showChannelSettingsDialog")

# Ensure channelDescription field
if "channelDescription" not in t:
    t = t.replace(
        "private var chatType: String = \"direct\"",
        "private var chatType: String = \"direct\"\n    private var channelDescription: String? = null",
        1,
    )

# Ensure showChannelMembers exists
if "fun showChannelMembers" not in t:
    fn = r'''
    private fun showChannelMembers() {
        val parts = try { participantIds } catch (_: Exception) { emptyList<String>() }
        if (parts.isEmpty()) {
            Toast.makeText(this, R.string.no_members, Toast.LENGTH_SHORT).show()
            return
        }
        val labels = parts.map { it.take(8) }.toTypedArray()
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(getString(R.string.channel_members_title, parts.size))
            .setItems(labels, null)
            .setPositiveButton(android.R.string.ok, null)
            .show()
    }
'''
    idx = t.rfind("\n}")
    t = t[:idx] + fn + t[idx:]
    print("added showChannelMembers")

print("braces", t.count("{"), t.count("}"))
if t.count("{") == t.count("}"):
    p.write_text(t)
    print("SAVED")
else:
    print("BRACE_ABORT")
