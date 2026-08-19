from pathlib import Path
p = Path("app/src/main/res/values/strings.xml")
t = p.read_text()
needed = {
    "change_channel_photo": "تغيير صورة القناة",
    "channel_settings": "إعدادات القناة",
    "share_channel": "مشاركة القناة",
    "share_channel_text": "انضم لقناة «%1$s» في دردشة العرب\nرمز القناة: %2$s",
    "channel_updated": "تم تحديث القناة",
    "channel_members_short": "الأعضاء",
    "members_count": "%1$d عضو",
    "channel_members_title": "الأعضاء (%1$d)",
    "no_members": "لا يوجد أعضاء",
    "channel_readonly_hint": "للقراءة فقط — المشرفون فقط يرسلون",
    "error_channel_name": "أدخل اسم القناة",
    "save": "حفظ",
    "uploading_photo": "جاري رفع الصورة…",
}
added = []
for k, v in needed.items():
    if f'name="{k}"' not in t:
        t = t.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
        added.append(k)
p.write_text(t)
print("ADDED", added if added else "none")
