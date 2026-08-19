from pathlib import Path
p = Path("app/src/main/AndroidManifest.xml")
t = p.read_text()
if "POST_NOTIFICATIONS" not in t:
    t = t.replace(
        "<uses-permission android:name=\"android.permission.INTERNET\" />",
        "<uses-permission android:name=\"android.permission.INTERNET\" />\n    <uses-permission android:name=\"android.permission.POST_NOTIFICATIONS\" />",
    )
    if "POST_NOTIFICATIONS" not in t:
        t = t.replace(
            "<manifest",
            "<manifest",
            1,
        )
        # insert after manifest opening tag children
        import re
        t = re.sub(
            r"(<manifest[^>]*>)",
            r"\1\n    <uses-permission android:name=\"android.permission.POST_NOTIFICATIONS\" />",
            t,
            count=1,
        )
    p.write_text(t)
    print("PERMISSION_ADDED")
else:
    print("PERMISSION_EXISTS")
