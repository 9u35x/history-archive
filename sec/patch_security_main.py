from pathlib import Path
import re

# --- strings ---
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
    "password_too_short": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    "password_mismatch": "كلمتا المرور غير متطابقتين",
    "spam_blocked": "تم إرسال رسائل كثيرة. انتظر دقيقة ثم أعد المحاولة.",
}
for k, v in needed.items():
    if f'name="{k}"' not in st:
        st = st.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
        print("string", k)
sp.write_text(st)

# --- ChatActivity: spam guard on send + report menu if possible ---
cp = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
if cp.exists():
    t = cp.read_text()
    # inject spam check at start of sendTextMessage if exists
    if "SpamGuard.canSend" not in t:
        m = re.search(r'private fun sendTextMessage\s*\(\s*\)\s*\{', t)
        if m:
            insert = '''private fun sendTextMessage() {
        if (!SpamGuard.canSend()) {
            Toast.makeText(this, R.string.spam_blocked, Toast.LENGTH_SHORT).show()
            return
        }
'''
            t = t[:m.start()] + insert + t[m.end():]
            print("spam in sendTextMessage")
        else:
            # try sendMessage
            m2 = re.search(r'private fun sendMessage\s*\(\s*\)\s*\{', t)
            if m2:
                insert = '''private fun sendMessage() {
        if (!SpamGuard.canSend()) {
            Toast.makeText(this, R.string.spam_blocked, Toast.LENGTH_SHORT).show()
            return
        }
'''
                t = t[:m2.start()] + insert + t[m2.end():]
                print("spam in sendMessage")
            else:
                print("NO_SEND_FN")
    # report from peer profile open area - add long press on title optional
    if "showReportDialog" not in t and "fun showReportDialog" not in t:
        fn = r'''
    private fun showReportDialog(reportedUid: String) {
        if (reportedUid.isBlank()) return
        val reasons = arrayOf(
            getString(R.string.report_reason_spam),
            getString(R.string.report_reason_abuse),
            getString(R.string.report_reason_scam),
            getString(R.string.report_reason_other)
        )
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(R.string.report_title)
            .setItems(reasons) { _, which ->
                ReportHelper.submitReport(
                    reportedUserId = reportedUid,
                    reason = reasons[which],
                    chatId = chatId
                ) { ok, err ->
                    Toast.makeText(
                        this,
                        if (ok) getString(R.string.report_sent) else (err ?: getString(R.string.report_failed)),
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }
'''
        idx = t.rfind("\n}")
        t = t[:idx] + fn + t[idx:]
        print("showReportDialog added")

    # Wire long-press on title for direct chats to report
    if "showReportDialog(" not in t.split("setOnLongClickListener")[0] if False else True:
        if "tvTitle.setOnLongClickListener" not in t and "tvChatTitle" in t:
            # after tvTitle.setOnClickListener block - add long click
            if "setOnLongClickListener" not in t or t.count("showReportDialog") < 2:
                t = t.replace(
                    "tvTitle.setOnClickListener",
                    '''tvTitle.setOnLongClickListener {
            val peer = try { otherUserId } catch (_: Exception) { null }
                ?: try { peerUid } catch (_: Exception) { null }
            if (chatType == "direct" && !peer.isNullOrBlank()) {
                showReportDialog(peer)
                true
            } else false
        }
        tvTitle.setOnClickListener''',
                    1,
                )
                print("long click report wired")

    print("chat braces", t.count("{"), t.count("}"))
    if t.count("{") == t.count("}"):
        cp.write_text(t)
        print("CHAT_OK")
    else:
        print("CHAT_BRACE_ABORT")
else:
    print("no ChatActivity")

# --- ProfileActivity: report button when viewing other + change password ---
pp = Path("app/src/main/java/com/arabchat/app/ProfileActivity.kt")
if pp.exists():
    pt = pp.read_text()
    if "fun changePassword" not in pt:
        fn = r'''
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
                auth.currentUser?.updatePassword(p1)
                    ?.addOnSuccessListener {
                        Toast.makeText(this, R.string.password_changed, Toast.LENGTH_SHORT).show()
                    }
                    ?.addOnFailureListener { e ->
                        Toast.makeText(this, e.message ?: getString(R.string.password_change_failed), Toast.LENGTH_LONG).show()
                    }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }
'''
        # need auth field - ProfileActivity usually has auth
        if "private lateinit var auth" not in pt and "FirebaseAuth" in pt:
            pass
        idx = pt.rfind("\n}")
        pt = pt[:idx] + fn + pt[idx:]
        print("changePassword added")

    # wire settings or a text view - look for tvSettings or similar
    if "changePassword()" not in pt:
        if "tvSettings" in pt:
            pt = pt.replace(
                "tvSettings.setOnClickListener",
                '''// long press settings = change password
        findViewById<TextView>(R.id.tvSettings)?.setOnLongClickListener {
            changePassword(); true
        }
        tvSettings.setOnClickListener''',
                1,
            )
            print("settings long-press password")
        elif 'getString(R.string.logout)' in pt or "تسجيل الخروج" in pt:
            # add near logout click - not ideal
            print("manual wire password later")
        else:
            print("no settings id")

    # report when viewing other profile
    if "ReportHelper.submitReport" not in pt:
        # if targetUid != me show report in options
        if "fun showReportFromProfile" not in pt:
            fn = r'''
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
                    Toast.makeText(
                        this,
                        if (ok) getString(R.string.report_sent) else (err ?: getString(R.string.report_failed)),
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }
'''
            idx = pt.rfind("\n}")
            pt = pt[:idx] + fn + pt[idx:]
            print("profile report fn")

    print("profile braces", pt.count("{"), pt.count("}"))
    if pt.count("{") == pt.count("}"):
        pp.write_text(pt)
        print("PROFILE_OK")
    else:
        print("PROFILE_BRACE_ABORT")
else:
    print("no ProfileActivity")

print("DONE")
