from pathlib import Path
p = Path("app/src/main/res/values/strings.xml")
t = p.read_text()
needed = {
    "members_count": "%1$d عضو",
    "channel_members_title": "الأعضاء (%1$d)",
    "no_members": "لا يوجد أعضاء",
    "channel_readonly_hint": "للقراءة فقط — المشرفون فقط يرسلون",
}
added = []
for k, v in needed.items():
    if f'name="{k}"' not in t:
        t = t.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
        added.append(k)
p.write_text(t)
print("ADDED", added if added else "none")
