from pathlib import Path
p = Path("app/src/main/res/values/strings.xml")
t = p.read_text()
needed = {
    "block_user": "حظر",
    "unblock_user": "إلغاء الحظر",
    "block_confirm": "هل تريد حظر هذا المستخدم؟ لن يظهر في محادثاتك.",
    "unblock_confirm": "إلغاء حظر %1$s؟",
    "user_blocked": "تم حظر المستخدم",
    "user_unblocked": "تم إلغاء الحظر",
    "no_blocked_users": "لا يوجد مستخدمون محظورون",
    "blocked_users": "المحظورون",
}
added = []
for k, v in needed.items():
    if f'name="{k}"' not in t:
        t = t.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
        added.append(k)
p.write_text(t)
print("ADDED", added if added else "none")
