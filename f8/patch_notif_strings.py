from pathlib import Path
p = Path("app/src/main/res/values/strings.xml")
t = p.read_text()
needed = {
    "notif_channel_name": "رسائل دردشة العرب",
    "notif_channel_desc": "إشعارات الرسائل الجديدة",
}
added=[]
for k,v in needed.items():
    if f'name="{k}"' not in t:
        t=t.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
        added.append(k)
p.write_text(t)
print("ADDED", added if added else "none")
