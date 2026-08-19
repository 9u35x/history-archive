from pathlib import Path
sp = Path("app/src/main/res/values/strings.xml")
st = sp.read_text()
needed = {
    "error_username_format": "اسم المستخدم: إنجليزي وأرقام و _ فقط (3 إلى 20)",
    "error_username_taken": "اسم المستخدم مستخدم من حساب آخر",
}
for k, v in needed.items():
    if f'name="{k}"' not in st:
        st = st.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
        print("added", k)
sp.write_text(st)
print("done")
