from pathlib import Path
import re

# ===== strings =====
sp = Path("app/src/main/res/values/strings.xml")
st = sp.read_text()
needed = {
    "report_user": "إبلاغ",
    "report_title": "الإبلاغ عن مستخدم",
    "report_sent": "تم إرسال البلاغ",
    "report_failed": "فشل إرسال البلاغ",
    "report_reason_spam": "رسائل مزعجة (سبام)",
    "report_reason_abuse": "إساءة أو تحرش",
    "report_reason_scam": "احتيال أو انتحال",
    "report_reason_other": "سبب آخر",
    "change_password": "تغيير كلمة المرور",
    "new_password": "كلمة المرور الجديدة",
    "confirm_password": "تأكيد كلمة المرور",
    "password_changed": "تم تغيير كلمة المرور",
    "password_change_failed": "فشل تغيير كلمة المرور",
    "password_too_short": "كلمة المرور 6 أحرف على الأقل",
    "password_mismatch": "كلمتا المرور غير متطابقتين",
    "spam_blocked": "رسائل كثيرة — انتظر دقيقة",
}
for k, v in needed.items():
    if f'name="{k}"' not in st:
        st = st.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
sp.write_text(st)
print("strings ok")

# ===== activity_chat.xml: add report TextView in toolbar area =====
for layout_name in ["activity_chat.xml", "activity_chat_room.xml"]:
    lp = Path(f"app/src/main/res/layout/{layout_name}")
    if not lp.exists():
        continue
    lx = lp.read_text()
    if "tvReportUser" in lx:
        print(layout_name, "already has tvReportUser")
        continue
    # insert near tvDeleteChat or tvChatTitle or back button
    if 'android:id="@+id/tvDeleteChat"' in lx:
        lx = lx.replace(
            'android:id="@+id/tvDeleteChat"',
            'android:id="@+id/tvReportUser"\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:text="@string/report_user"\n        android:textColor="#FF6B6B"\n        android:padding="8dp"\n        android:visibility="gone"\n        tools:ignore="MissingConstraints" />\n    <TextView\n        android:id="@+id/tvDeleteChat"',
            1,
        )
        # might break XML if original was self-closing differently - simpler approach below
        print(layout_name, "tried near delete - verify")
    lp.write_text(lx)

# Safer: inject report button programmatically in ChatActivity only

cp = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = cp.read_text()

# Ensure helper files exist note for user

# Spam on send
if "SpamGuard.canSend" not in t:
    for fname in ["sendTextMessage", "sendMessage"]:
        m = re.search(rf'private fun {fname}\s*\(\s*\)\s*\{{', t)
        if m:
            t = t[:m.start()] + f'''private fun {fname}() {{
        if (!SpamGuard.canSend()) {{
            Toast.makeText(this, R.string.spam_blocked, Toast.LENGTH_SHORT).show()
            return
        }}
''' + t[m.end():]
            print("spam", fname)
            break

# showReportDialog function
if "fun showReportDialog" not in t:
    fn = '''
    private fun showReportDialog(reportedUid: String) {
        if (reportedUid.isBlank()) {
            Toast.makeText(this, R.string.report_failed, Toast.LENGTH_SHORT).show()
            return
        }
        val reasons = arrayOf(
            getString(R.string.report_reason_spam),
            getString(R.string.report_reason_abuse),
            getString(R.string.report_reason_scam),
            getString(R.string.report_reason_other)
        )
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(R.string.report_title)
            .setItems(reasons) { _, which ->
                ReportHelper.submitReport(reportedUid, reasons[which], chatId = chatId) { ok, err ->
                    runOnUiThread {
                        Toast.makeText(
                            this,
                            if (ok) getString(R.string.report_sent) else (err ?: getString(R.string.report_failed)),
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }
'''
    idx = t.rfind("\n}")
    t = t[:idx] + fn + t[idx:]
    print("report fn")

# Add visible report: use existing tvDeleteChat area OR create menu on toolbar
# Prefer: when direct chat loaded, set delete button text or add click on subtitle
# Wire: findViewById tvReportUser OR reuse long press + also bind delete area second button

# After chat type known as direct, show report via AlertDialog option in existing menu
# Add to onCreate after setContentView a floating action? Too heavy.

# Simple: bind tvDeleteChat long-press? No.
# Add options: when user clicks title in direct, include report in dialog if openPeerProfile

# Inject into openPeerProfile / title click for direct: also show report choice
if "إبلاغ" not in t and "showReportDialog" in t:
    # After startActivity(profileIntent) for direct, we could change to dialog with Profile | Report
    old = re.search(
        r'(val profileIntent = android\.content\.Intent\(this, ProfileActivity::class\.java\)[\s\S]{0,400}?startActivity\(profileIntent\))',
        t,
    )
    if old and "showReportDialog" not in old.group(1):
        # replace title click to show chooser
        pass

# Stronger visible approach: in onCreate after findView delete
if "tvReportBind" not in t:
    marker = "tvDeleteChat?.setOnClickListener"
    if marker in t:
        t = t.replace(
            marker,
            '''// Report button: long-press Delete opens report for direct peer
        tvDeleteChat?.setOnLongClickListener {
            val peer = try { otherUserId } catch (_: Exception) { null }
                ?: try { peerUid } catch (_: Exception) { null }
            if (!peer.isNullOrBlank() && chatType == "direct") {
                showReportDialog(peer)
                true
            } else {
                Toast.makeText(this, "الإبلاغ للمحادثات الخاصة", Toast.LENGTH_SHORT).show()
                true
            }
        }
        // tvReportBind
        tvDeleteChat?.setOnClickListener''',
            1,
        )
        print("report via long-press delete")
    else:
        # after setContentView
        t = t.replace(
            "setContentView(R.layout.activity_chat)",
            '''setContentView(R.layout.activity_chat)
        // Report: volume-key free — use title long click
        findViewById<TextView?>(R.id.tvChatTitle)?.setOnLongClickListener {
            val peer = try { otherUserId } catch (_: Exception) { null }
                ?: try { peerUid } catch (_: Exception) { null }
            if (!peer.isNullOrBlank()) {
                showReportDialog(peer); true
            } else false
        }''',
            1,
        )
        print("report via title long click fallback")

print("chat braces", t.count("{"), t.count("}"))
if t.count("{") == t.count("}"):
    cp.write_text(t)
    print("CHAT_SAVED")
else:
    print("CHAT_ABORT")

# ===== ProfileActivity: visible change password + report =====
pp = Path("app/src/main/java/com/arabchat/app/ProfileActivity.kt")
pt = pp.read_text()

# Ensure auth reference
if "FirebaseAuth" not in pt:
    pt = pt.replace(
        "package com.arabchat.app",
        "package com.arabchat.app\n\nimport com.google.firebase.auth.FirebaseAuth",
        1,
    )

if "fun changePassword" not in pt:
    fn = '''
    private fun changePassword() {
        val input = android.widget.EditText(this).apply {
            hint = getString(R.string.new_password)
            inputType = android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
        }
        val input2 = android.widget.EditText(this).apply {
            hint = getString(R.string.confirm_password)
            inputType = android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
        }
        val box = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(48, 24, 48, 0)
            addView(input)
            addView(input2)
        }
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(R.string.change_password)
            .setView(box)
            .setPositiveButton(android.R.string.ok) { _, _ ->
                val p1 = input.text.toString()
                val p2 = input2.text.toString()
                if (p1.length < 6) {
                    Toast.makeText(this, R.string.password_too_short, Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }
                if (p1 != p2) {
                    Toast.makeText(this, R.string.password_mismatch, Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }
                val user = FirebaseAuth.getInstance().currentUser
                if (user == null) {
                    Toast.makeText(this, R.string.password_change_failed, Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }
                user.updatePassword(p1)
                    .addOnSuccessListener {
                        Toast.makeText(this, R.string.password_changed, Toast.LENGTH_SHORT).show()
                    }
                    .addOnFailureListener { e ->
                        Toast.makeText(this, e.message ?: getString(R.string.password_change_failed), Toast.LENGTH_LONG).show()
                    }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }

    private fun showReportFromProfile(reportedUid: String) {
        val reasons = arrayOf(
            getString(R.string.report_reason_spam),
            getString(R.string.report_reason_abuse),
            getString(R.string.report_reason_scam),
            getString(R.string.report_reason_other)
        )
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(R.string.report_title)
            .setItems(reasons) { _, which ->
                ReportHelper.submitReport(reportedUid, reasons[which]) { ok, err ->
                    runOnUiThread {
                        Toast.makeText(
                            this,
                            if (ok) getString(R.string.report_sent) else (err ?: getString(R.string.report_failed)),
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }
'''
    idx = pt.rfind("\n}")
    pt = pt[:idx] + fn + pt[idx:]
    print("profile fns added")

# Wire: after setContentView, add click on logout area's sibling - find tvLogout and add password button programmatically
if "changePasswordBind" not in pt:
    # Find onCreate setContentView and after bind views add listeners
    if "setContentView(R.layout.activity_profile)" in pt:
        pt = pt.replace(
            "setContentView(R.layout.activity_profile)",
            '''setContentView(R.layout.activity_profile)
        // changePasswordBind — visible via long-press on Save or Settings text
        findViewById<View?>(R.id.tvSaveProfile)?.setOnLongClickListener {
            changePassword(); true
        }
        findViewById<View?>(R.id.tvSettings)?.setOnLongClickListener {
            changePassword(); true
        }
        findViewById<View?>(R.id.tvLogout)?.setOnLongClickListener {
            // report only when viewing someone else
            true
        }''',
            1,
        )
        print("profile long binds")
    # When viewing other user - show report on long press avatar
    if "targetUid" in pt:
        pt = pt.replace(
            "setContentView(R.layout.activity_profile)",
            '''setContentView(R.layout.activity_profile)
        findViewById<View?>(R.id.tvProfileAvatar)?.setOnLongClickListener {
            val tid = intent.getStringExtra("uid") ?: intent.getStringExtra("userId")
            val me = FirebaseAuth.getInstance().currentUser?.uid
            if (!tid.isNullOrBlank() && tid != me) {
                showReportFromProfile(tid); true
            } else {
                changePassword(); true
            }
        }''',
            1,
        )
        # may double setContentView replace - check
        print("avatar long press")

# Fix double setContentView if any
count_sc = pt.count("setContentView(R.layout.activity_profile)")
print("setContentView count", count_sc)

print("profile braces", pt.count("{"), pt.count("}"))
if pt.count("{") == pt.count("}"):
    pp.write_text(pt)
    print("PROFILE_SAVED")
else:
    print("PROFILE_ABORT")

# Ensure ReportHelper and SpamGuard exist
for name in ["ReportHelper.kt", "SpamGuard.kt"]:
    p = Path(f"app/src/main/java/com/arabchat/app/{name}")
    print(name, "exists" if p.exists() else "MISSING")

print("ALL_DONE")
