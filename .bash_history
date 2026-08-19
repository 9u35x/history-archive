print("LocaleHelper written")
PY

python3 << 'PY'
from pathlib import Path
p = Path("app/src/main/java/com/arabchat/app/SettingsActivity.kt")
t = p.read_text()
if "tvLanguage" not in t:
    wire = '''
        findViewById<TextView?>(R.id.tvLanguage)?.setOnClickListener {
            val langs = arrayOf(
                "العربية" to "ar",
                "English" to "en",
                "Français" to "fr",
                "Türkçe" to "tr",
                "اردو" to "ur",
                "فارسی" to "fa",
                "Deutsch" to "de",
                "Español" to "es",
                "हिन्दी" to "hi",
                "Indonesia" to "in"
            )
            androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle(getString(R.string.language))
                .setItems(langs.map { it.first }.toTypedArray()) { _, which ->
                    LocaleHelper.apply(this, langs[which].second)
                    recreate()
                }
                .show()
        }
'''
    if "setContentView" in t:
        # بعد setContentView
        import re
        t = re.sub(
            r'(setContentView\([^)]+\))',
            r'\1\n' + wire,
            t,
            count=1,
        )
    print("wired language")

print("braces", t.count("{"), t.count("}"))
if t.count("{")==t.count("}"):
    p.write_text(t)
    print("SETTINGS_OK")
else:
    print("SETTINGS_BAD")
PY

# طبّق اللغة عند بدء التطبيق
python3 << 'PY'
from pathlib import Path
# Application class أو كل Activity — أبسط: LoginActivity + HomeActivity attachBaseContext
for name in ["LoginActivity.kt", "HomeActivity.kt", "SettingsActivity.kt"]:
    p = Path(f"app/src/main/java/com/arabchat/app/{name}")
    if not p.exists(): continue
    t = p.read_text()
    if "attachBaseContext" in t:
        print(name, "already")
        continue
    fn = '''
    override fun attachBaseContext(newBase: android.content.Context) {
        super.attachBaseContext(LocaleHelper.wrap(newBase))
    }
'''
    # داخل الكلاس قبل آخر }
    if t.rstrip().endswith("}"):
        t = t.rstrip()[:-1] + fn + "\n}\n"
        if t.count("{")==t.count("}"):
            p.write_text(t)
            print(name, "OK")
        else:
            print(name, "BAD")
PY

git add app/src/main/res app/src/main/java/com/arabchat/app/LoginActivity.kt   app/src/main/java/com/arabchat/app/SettingsActivity.kt   app/src/main/java/com/arabchat/app/LocaleHelper.kt   app/src/main/java/com/arabchat/app/HomeActivity.kt
git status
git commit -m "feat: YTalk branding, forgot password, 10 languages"
git push origin main
cd $HOME/myproject
python3 << 'PY'
from pathlib import Path
import re

for path in Path("app/src/main/res").glob("values*/strings.xml"):
    t = path.read_text()
    orig = t
    # استبدل ' داخل محتوى <string> بـ \'
    def fix(m):
        name = m.group(1)
        attrs = m.group(2) or ""
        body = m.group(3)
        if "'" in body or "’" in body:
            body = body.replace("'", r"\'").replace("’", r"\'")
            if "formatted=" not in attrs:
                attrs = (attrs + ' formatted="false"').strip()
            return f'<string name="{name}" {attrs}>{body}</string>' if attrs else f'<string name="{name}" formatted="false">{body}</string>'
        return m.group(0)
    t2 = re.sub(
        r'<string name="([^"]+)"([^>]*)>([^<]*)</string>',
        fix,
        t,
    )
    # تأكد الفرنسي تحديداً
    t2 = t2.replace("S'inscrire", r"S\'inscrire")
    t2 = t2.replace("S’inscrire", r"S\'inscrire")
    if t2 != orig:
        path.write_text(t2)
        print("fixed", path)
    else:
        print("ok", path)

# عرض سطر register في fr
fr = Path("app/src/main/res/values-fr/strings.xml")
if fr.exists():
    for l in fr.read_text().splitlines():
        if "register" in l:
            print("FR:", l)
PY

git add app/src/main/res/values*/strings.xml
git commit -m "fix: escape apostrophes in localized strings"
git push origin main
cd $HOME/myproject
python3 << 'PY'
from pathlib import Path
import re

p = Path("app/src/main/java/com/arabchat/app/HomeActivity.kt")
t = p.read_text()

# احذف أي attachBaseContext داخل Adapter أو خارج Activity بالخطأ
t2 = re.sub(
    r'\n\s*override fun attachBaseContext\(newBase: [^\)]*\)\s*\{\s*'
    r'super\.attachBaseContext\(LocaleHelper\.wrap\(newBase\)\)\s*\}\s*',
    '\n',
    t,
)
print("removed count approx", t.count("attachBaseContext") - t2.count("attachBaseContext"))

# أضف داخل HomeActivity بعد تعريف الكلاس
if "class HomeActivity" in t2 and "override fun attachBaseContext" not in t2:
    t2 = re.sub(
        r'(class HomeActivity\s*:\s*[^{]+\{)',
        r'''\1
    override fun attachBaseContext(newBase: android.content.Context) {
        super.attachBaseContext(LocaleHelper.wrap(newBase))
    }
''',
        t2,
        count=1,
    )
    print("added to HomeActivity")
else:
    print("HomeActivity already has it or class not found", "attachBaseContext" in t2)

print("braces", t2.count("{"), t2.count("}"))
print("occurrences", t2.count("fun attachBaseContext"))
if t2.count("{") == t2.count("}") and t2.count("fun attachBaseContext") == 1:
    p.write_text(t2)
    print("HOME_OK")
else:
    # إذا صفر — أضف؛ إذا أكثر من 1 اترك واحد فقط داخل Activity
    if t2.count("fun attachBaseContext") == 0 and "class HomeActivity" in t2:
        t2 = re.sub(
            r'(class HomeActivity\s*:\s*[^{]+\{)',
            r'''\1
    override fun attachBaseContext(newBase: android.content.Context) {
        super.attachBaseContext(LocaleHelper.wrap(newBase))
    }
''',
            t2,
            count=1,
        )
    if t2.count("{") == t2.count("}"):
        p.write_text(t2)
        print("HOME_OK2", t2.count("fun attachBaseContext"))
    else:
        print("HOME_BAD")

# نفس الإصلاح لـ Login و Settings إن وُضع خطأ
for name in ["LoginActivity.kt", "SettingsActivity.kt"]:
    path = Path(f"app/src/main/java/com/arabchat/app/{name}")
    if not path.exists():
        continue
    tt = path.read_text()
    # احذف المكرر ثم تأكد واحد داخل الكلاس
    tt2 = re.sub(
        r'\n\s*override fun attachBaseContext\(newBase: [^\)]*\)\s*\{\s*'
        r'super\.attachBaseContext\(LocaleHelper\.wrap\(newBase\)\)\s*\}\s*',
        '\n',
        tt,
    )
    cls = name.replace(".kt", "")
    if f"class {cls}" in tt2 and "fun attachBaseContext" not in tt2:
        tt2 = re.sub(
            rf'(class {cls}\s*:\s*[^{{]+{{)',
            r'''\1
    override fun attachBaseContext(newBase: android.content.Context) {
        super.attachBaseContext(LocaleHelper.wrap(newBase))
    }
''',
            tt2,
            count=1,
        )
    if tt2.count("{") == tt2.count("}"):
        path.write_text(tt2)
        print(name, "OK", tt2.count("fun attachBaseContext"))
    else:
        print(name, "BAD")
PY

grep -n "attachBaseContext\|class Home\|class HomeStory" app/src/main/java/com/arabchat/app/HomeActivity.kt | head -20
git add app/src/main/java/com/arabchat/app/HomeActivity.kt   app/src/main/java/com/arabchat/app/LoginActivity.kt   app/src/main/java/com/arabchat/app/SettingsActivity.kt
git commit -m "fix: move attachBaseContext to Activities only"
git push origin main
cd $HOME/myproject
# استخدم @string في العناصر الظاهرة بالإعدادات والهوم
python3 << 'PY'
from pathlib import Path
import re

# activity_home — عنوان ثابت إن وجد
home = Path("app/src/main/res/layout/activity_home.xml")
if home.exists():
    t = home.read_text()
    t = t.replace('android:text="دردشة العرب"', 'android:text="@string/app_name"')
    t = t.replace('android:text="YTalk"', 'android:text="@string/app_name"')
    t = t.replace('android:text="قنوات"', 'android:text="@string/channels"')
    t = t.replace('android:text="القصص"', 'android:text="@string/stories"')
    t = t.replace('android:text="قصتي"', 'android:text="@string/my_story"')
    t = t.replace('android:text="تسجيل الخروج"', 'android:text="@string/logout"')
    t = t.replace('android:hint="بحث عن مستخدمين أو قنوات..."', 'android:hint="@string/search_hint"')
    home.write_text(t)
    print("home layout patched")

# أضف مفاتيح ناقصة لكل اللغات
extra = {
    "my_story": {
        "values": "قصتي", "values-en": "My story", "values-fr": "Ma story",
        "values-tr": "Hikayem", "values-ur": "میری اسٹوری", "values-fa": "استوری من",
        "values-de": "Meine Story", "values-es": "Mi historia", "values-hi": "मेरी स्टोरी",
        "values-in": "Cerita saya",
    },
    "notifications": {
        "values": "الإشعارات", "values-en": "Notifications", "values-fr": "Notifications",
        "values-tr": "Bildirimler", "values-ur": "اطلاعات", "values-fa": "اعلان‌ها",
        "values-de": "Benachrichtigungen", "values-es": "Notificaciones", "values-hi": "सूचनाएं",
        "values-in": "Notifikasi",
    },
    "change_password": {
        "values": "تغيير كلمة المرور", "values-en": "Change password", "values-fr": "Changer le mot de passe",
        "values-tr": "Şifreyi değiştir", "values-ur": "پاس ورڈ تبدیل", "values-fa": "تغییر رمز",
        "values-de": "Passwort ändern", "values-es": "Cambiar contraseña", "values-hi": "पासवर्ड बदलें",
        "values-in": "Ubah kata sandi",
    },
    "about": {
        "values": "عن التطبيق", "values-en": "About", "values-fr": "À propos",
        "values-tr": "Hakkında", "values-ur": "ایپ کے بارے", "values-fa": "درباره برنامه",
        "values-de": "Über die App", "values-es": "Acerca de", "values-hi": "ऐप के बारे में",
        "values-in": "Tentang aplikasi",
    },
    "privacy": {
        "values": "سياسة الخصوصية", "values-en": "Privacy policy", "values-fr": "Confidentialité",
        "values-tr": "Gizlilik", "values-ur": "رازداری", "values-fa": "حریم خصوصی",
        "values-de": "Datenschutz", "values-es": "Privacidad", "values-hi": "गोपनीयता",
        "values-in": "Privasi",
    },
    "blocked": {
        "values": "المحظورون", "values-en": "Blocked", "values-fr": "Bloqués",
        "values-tr": "Engellenenler", "values-ur": "مسدود", "values-fa": "مسدودها",
        "values-de": "Blockiert", "values-es": "Bloqueados", "values-hi": "ब्लॉक किए",
        "values-in": "Diblokir",
    },
}

for key, langs in extra.items():
    for folder, text in langs.items():
        path = Path(f"app/src/main/res/{folder}/strings.xml")
        if not path.exists():
            continue
        t = path.read_text()
        if f'name="{key}"' in t:
            t = re.sub(
                rf'<string name="{key}"[^>]*>[^<]*</string>',
                f'<string name="{key}">{text}</string>',
                t,
            )
        else:
            t = t.replace("</resources>", f'    <string name="{key}">{text}</string>\n</resources>')
        path.write_text(t)
print("extra keys done")

# settings layout نصوص ثابتة
st = Path("app/src/main/res/layout/activity_settings.xml")
if st.exists():
    t = st.read_text()
    reps = [
        ('android:text="تغيير كلمة المرور"', 'android:text="@string/change_password"'),
        ('android:text="عن التطبيق"', 'android:text="@string/about"'),
        ('android:text="سياسة الخصوصية"', 'android:text="@string/privacy"'),
        ('android:text="المحظورون"', 'android:text="@string/blocked"'),
        ('android:text="Language"', 'android:text="@string/language"'),
        ('android:text="اللغة"', 'android:text="@string/language"'),
        ('android:text="Log out"', 'android:text="@string/logout"'),
        ('android:text="تسجيل الخروج"', 'android:text="@string/logout"'),
        ('android:text="الإعدادات"', 'android:text="@string/settings"'),
    ]
    for a,b in reps:
        t = t.replace(a, b)
    st.write_text(t)
    print("settings layout patched")
PY

# بعد اختيار اللغة أعد تشغيل التطبيق بالكامل (مو recreate فقط)
python3 << 'PY'
from pathlib import Path
p = Path("app/src/main/java/com/arabchat/app/SettingsActivity.kt")
t = p.read_text()
old = "LocaleHelper.apply(this, langs[which].second)\n                    recreate()"
new = '''LocaleHelper.apply(this, langs[which].second)
                    val i = android.content.Intent(this, HomeActivity::class.java)
                    i.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK or android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK)
                    startActivity(i)
                    finishAffinity()'''
if old in t:
    t = t.replace(old, new, 1)
    p.write_text(t)
    print("restart on language change OK")
else:
    print("pattern miss - search:")
    for i,l in enumerate(t.splitlines(),1):
        if "LocaleHelper" in l or "recreate" in l:
            print(i, l)
PY

git add app/src/main/res app/src/main/java/com/arabchat/app/SettingsActivity.kt
git commit -m "fix: wire more UI strings to resources + full restart on language change"
git push origin main
cd $HOME/myproject
python3 << 'PY'
from pathlib import Path
import re

# كل المفاتيح المطلوبة + 10 لغات
T = {
"settings": dict(values="الإعدادات", en="Settings", fr="Paramètres", tr="Ayarlar", ur="ترتیبات", fa="تنظیمات", de="Einstellungen", es="Ajustes", hi="सेटिंग्स", ind="Pengaturan"),
"notifications": dict(values="الإشعارات", en="Notifications", fr="Notifications", tr="Bildirimler", ur="اطلاعات", fa="اعلان‌ها", de="Benachrichtigungen", es="Notificaciones", hi="सूचनाएं", ind="Notifikasi"),
"notifications_sub": dict(values="تفعيل تنبيهات الرسائل الجديدة", en="Enable new message alerts", fr="Activer les alertes", tr="Yeni mesaj uyarıları", ur="نئی پیغام الرٹس", fa="هشدار پیام جدید", de="Neue Nachrichten", es="Alertas de mensajes", hi="संदेश अलर्ट", ind="Peringatan pesan baru"),
"last_seen": dict(values="آخر ظهور", en="Last seen", fr="Dernière connexion", tr="Son görülme", ur="آخری بار دیکھا", fa="آخرین بازدید", de="Zuletzt online", es="Última vez", hi="अंतिम बार", ind="Terakhir terlihat"),
"last_seen_sub": dict(values="إظهار آخر ظهور للآخرين", en="Show last seen to others", fr="Afficher la dernière connexion", tr="Son görülmeyi göster", ur="دوسروں کو دکھائیں", fa="نمایش برای دیگران", de="Für andere anzeigen", es="Mostrar a otros", hi="दूसरों को दिखाएं", ind="Tampilkan ke orang lain"),
"read_receipts": dict(values="إشعارات القراءة", en="Read receipts", fr="Accusés de lecture", tr="Okundu bilgisi", ur="پڑھنے کی اطلاع", fa="رسید خواندن", de="Lesebestätigungen", es="Confirmación de lectura", hi="पढ़ने की रसीद", ind="Tanda terbaca"),
"read_receipts_sub": dict(values="إظهار أن الرسالة قُرئت", en="Show when message was read", fr="Afficher si lu", tr="Okundu göster", ur="دکھائیں جب پڑھا", fa="نمایش خوانده شدن", de="Gelesen anzeigen", es="Mostrar leído", hi="पढ़ा दिखाएं", ind="Tampilkan sudah dibaca"),
"enter_to_send": dict(values="Enter للإرسال", en="Enter to send", fr="Entrée pour envoyer", tr="Enter ile gönder", ur="Enter سے بھیجیں", fa="ارسال با Enter", de="Enter zum Senden", es="Enter para enviar", hi="Enter से भेजें", ind="Enter untuk kirim"),
"enter_to_send_sub": dict(values="إرسال الرسالة بمفتاح الإدخال", en="Send message with Enter key", fr="Envoyer avec Entrée", tr="Enter tuşu ile gönder", ur="Enter سے بھیجیں", fa="ارسال با کلید Enter", de="Mit Enter senden", es="Enviar con Enter", hi="Enter से भेजें", ind="Kirim dengan Enter"),
"my_account": dict(values="حسابي", en="My account", fr="Mon compte", tr="Hesabım", ur="میرا اکاؤنٹ", fa="حساب من", de="Mein Konto", es="Mi cuenta", hi="मेरा खाता", ind="Akun saya"),
"channels": dict(values="القنوات", en="Channels", fr="Chaînes", tr="Kanallar", ur="چینلز", fa="کانال‌ها", de="Kanäle", es="Canales", hi="चैनल", ind="Saluran"),
"about": dict(values="عن التطبيق", en="About", fr="À propos", tr="Hakkında", ur="ایپ کے بارے", fa="درباره", de="Über", es="Acerca de", hi="के बारे में", ind="Tentang"),
"privacy": dict(values="سياسة الخصوصية", en="Privacy policy", fr="Confidentialité", tr="Gizlilik", ur="رازداری", fa="حریم خصوصی", de="Datenschutz", es="Privacidad", hi="गोपनीयता", ind="Privasi"),
"change_password": dict(values="تغيير كلمة المرور", en="Change password", fr="Changer le mot de passe", tr="Şifreyi değiştir", ur="پاس ورڈ تبدیل", fa="تغییر رمز", de="Passwort ändern", es="Cambiar contraseña", hi="पासवर्ड बदलें", ind="Ubah kata sandi"),
"language": dict(values="اللغة", en="Language", fr="Langue", tr="Dil", ur="زبان", fa="زبان", de="Sprache", es="Idioma", hi="भाषा", ind="Bahasa"),
"blocked": dict(values="المحظورون", en="Blocked", fr="Bloqués", tr="Engellenenler", ur="مسدود", fa="مسدودها", de="Blockiert", es="Bloqueados", hi="ब्लॉक", ind="Diblokir"),
"privacy_short": dict(values="الخصوصية", en="Privacy", fr="Confidentialité", tr="Gizlilik", ur="رازداری", fa="حریم خصوصی", de="Privatsphäre", es="Privacidad", hi="गोपनीयता", ind="Privasi"),
"clear_cache": dict(values="مسح الذاكرة المؤقتة", en="Clear cache", fr="Vider le cache", tr="Önbelleği temizle", ur="کیش صاف", fa="پاک کردن کش", de="Cache leeren", es="Borrar caché", hi="कैश साफ़", ind="Hapus cache"),
"logout": dict(values="تسجيل الخروج", en="Log out", fr="Déconnexion", tr="Çıkış", ur="لاگ آؤٹ", fa="خروج", de="Abmelden", es="Cerrar sesión", hi="लॉग आउट", ind="Keluar"),
"version": dict(values="الإصدار 1.0", en="Version 1.0", fr="Version 1.0", tr="Sürüm 1.0", ur="ورژن 1.0", fa="نسخه 1.0", de="Version 1.0", es="Versión 1.0", hi="संस्करण 1.0", ind="Versi 1.0"),
"stories": dict(values="القصص", en="Stories", fr="Stories", tr="Hikayeler", ur="اسٹوریز", fa="استوری‌ها", de="Stories", es="Historias", hi="स्टोरीज़", ind="Cerita"),
"my_story": dict(values="قصتي", en="My story", fr="Ma story", tr="Hikayem", ur="میری اسٹوری", fa="استوری من", de="Meine Story", es="Mi historia", hi="मेरी स्टोरी", ind="Cerita saya"),
"add_story": dict(values="إضافة", en="Add", fr="Ajouter", tr="Ekle", ur="شامل", fa="افزودن", de="Hinzufügen", es="Añadir", hi="जोड़ें", ind="Tambah"),
"search_hint": dict(values="بحث عن مستخدمين أو قنوات...", en="Search users or channels...", fr="Rechercher...", tr="Ara...", ur="تلاش...", fa="جستجو...", de="Suchen...", es="Buscar...", hi="खोजें...", ind="Cari..."),
"app_name": dict(values="YTalk", en="YTalk", fr="YTalk", tr="YTalk", ur="YTalk", fa="YTalk", de="YTalk", es="YTalk", hi="YTalk", ind="YTalk"),
}

folder_map = {
    "values": "values",
    "en": "values-en", "fr": "values-fr", "tr": "values-tr", "ur": "values-ur",
    "fa": "values-fa", "de": "values-de", "es": "values-es", "hi": "values-hi", "ind": "values-in",
}

for key, langs in T.items():
    for lang_key, folder in folder_map.items():
        text = langs.get("values" if lang_key == "values" else lang_key, langs["values"])
        # escape apostrophe
        text = text.replace("'", r"\'")
        path = Path(f"app/src/main/res/{folder}/strings.xml")
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists():
            t = path.read_text()
        else:
            t = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n'
        if f'name="{key}"' in t:
            t = re.sub(rf'<string name="{key}"[^>]*>[^<]*</string>', f'<string name="{key}">{text}</string>', t)
        else:
            t = t.replace("</resources>", f'    <string name="{key}">{text}</string>\n</resources>')
        path.write_text(t)
print("strings written")

# settings XML — استبدال النصوص الثابتة
st = Path("app/src/main/res/layout/activity_settings.xml")
t = st.read_text()
repl = [
    ("الإشعارات", "@string/notifications"),
    ("تفعيل تنبيهات الرسائل الجديدة", "@string/notifications_sub"),
    ("آخر ظهور", "@string/last_seen"),
    ("إظهار آخر ظهور للآخرين", "@string/last_seen_sub"),
    ("إشعارات القراءة", "@string/read_receipts"),
    ("إظهار أن الرسالة قُرئت", "@string/read_receipts_sub"),
    ("إظهار أن الرسالة قرئت", "@string/read_receipts_sub"),
    ("Enter للإرسال", "@string/enter_to_send"),
    ("للإرسال Enter", "@string/enter_to_send"),
    ("إرسال الرسالة بمفتاح الإدخال", "@string/enter_to_send_sub"),
    ("حسابي", "@string/my_account"),
    ("القنوات", "@string/channels"),
    ("عن التطبيق", "@string/about"),
    ("سياسة الخصوصية", "@string/privacy"),
    ("تغيير كلمة المرور", "@string/change_password"),
    ("Language", "@string/language"),
    ("اللغة", "@string/language"),
    ("المحظورون", "@string/blocked"),
    ("الخصوصية", "@string/privacy_short"),
    ("مسح الذاكرة المؤقتة", "@string/clear_cache"),
    ("Log out", "@string/logout"),
    ("تسجيل الخروج", "@string/logout"),
    ("الإعدادات", "@string/settings"),
    ("الإصدار 1.0", "@string/version"),
]
for ar, ref in repl:
    # android:text="..."
    t = t.replace(f'android:text="{ar}"', f'android:text="{ref}"')
    t = t.replace(f'android:text="{ar}', f'android:text="{ref}')  # partial safety
st.write_text(t)
print("settings xml done")

# home
h = Path("app/src/main/res/layout/activity_home.xml")
t = h.read_text()
for ar, ref in [
    ("القصص", "@string/stories"),
    ("قصتي", "@string/my_story"),
    ("قنوات", "@string/channels"),
    ("YTalk", "@string/app_name"),
    ("تسجيل الخروج", "@string/logout"),
    ("بحث عن مستخدمين أو قنوات...", "@string/search_hint"),
]:
    t = t.replace(f'android:text="{ar}"', f'android:text="{ref}"')
    t = t.replace(f'android:hint="{ar}"', f'android:hint="{ref}"')
h.write_text(t)
print("home xml done")
PY

# قصتي / إضافة من الكود
python3 << 'PY'
from pathlib import Path
p = Path("app/src/main/java/com/arabchat/app/HomeActivity.kt")
t = p.read_text()
t = t.replace('name = "قصتي"', 'name = context.getString(R.string.my_story)')  # may not work if no context
# في HomeStoryBarAdapter
t = t.replace(
    'holder.name.text = if (row.isAdd) "إضافة" else row.name',
    'holder.name.text = if (row.isAdd) holder.itemView.context.getString(R.string.add_story) else row.name',
)
t = t.replace(
    'name = "قصتي"',
    'name = getString(R.string.my_story)',
)
# rows.add HomeStoryRow isAdd
if 'name = "قصتي"' in t:
    print("still has قصتي")
print("braces", t.count("{"), t.count("}"))
if t.count("{")==t.count("}"):
    p.write_text(t)
    print("HOME_KT_OK")
else:
    print("BAD")
PY

git add app/src/main/res app/src/main/java/com/arabchat/app/HomeActivity.kt
git commit -m "i18n: translate all settings and home visible strings"
git push origin main
cd $HOME/myproject
python3 << 'PY'
from pathlib import Path
p = Path("app/src/main/java/com/arabchat/app/HomeActivity.kt")
t = p.read_text()
t2 = t.replace("context.getString(R.string.my_story)", "getString(R.string.my_story)")
t2 = t2.replace("context.getString(R.string.add_story)", "getString(R.string.add_story)")
print("replacements", t.count("context.getString") - t2.count("context.getString"))
print("braces", t2.count("{"), t2.count("}"))
if t2.count("{") == t2.count("}"):
    p.write_text(t2)
    print("OK")
else:
    print("BAD")
PY

grep -n "context.getString\|my_story\|add_story" app/src/main/java/com/arabchat/app/HomeActivity.kt
git add app/src/main/java/com/arabchat/app/HomeActivity.kt
git commit -m "fix: use Activity getString for my_story"
git push origin main
