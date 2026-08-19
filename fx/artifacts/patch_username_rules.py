from pathlib import Path
import re

# Strings
sp = Path("app/src/main/res/values/strings.xml")
st = sp.read_text()
needed = {
    "error_username_format": "اسم المستخدم: حروف إنجليزية وأرقام فقط (3-20)",
    "error_username_taken": "اسم المستخدم مستخدم مسبقاً",
    "username_at_hint": "username (English)",
}
for k,v in needed.items():
    if f'name="{k}"' not in st:
        st = st.replace("</resources>", f'    <string name="{k}">{v}</string>\n</resources>')
sp.write_text(st)
print("strings ok")

# Helper in ProfileActivity saveProfile validation
pp = Path("app/src/main/java/com/arabchat/app/ProfileActivity.kt")
if not pp.exists():
    print("no ProfileActivity")
else:
    pt = pp.read_text()
    if "isValidUsername" not in pt:
        fn = r'''
    private fun isValidUsername(username: String): Boolean {
        if (username.isEmpty()) return true // optional empty
        return username.matches(Regex("^[a-zA-Z0-9_]{3,20}$"))
    }

    private fun checkUsernameUnique(username: String, myUid: String, onResult: (Boolean) -> Unit) {
        if (username.isEmpty()) {
            onResult(true)
            return
        }
        db.collection("users")
            .whereEqualTo("username", username)
            .limit(5)
            .get()
            .addOnSuccessListener { snap ->
                val taken = snap.documents.any { it.id != myUid }
                onResult(!taken)
            }
            .addOnFailureListener { onResult(true) }
    }
'''
        idx = pt.rfind("\n}")
        pt = pt[:idx] + fn + pt[idx:]

    # Wrap saveProfile username checks
    if "isValidUsername(username)" not in pt:
        # after username = ...
        pt = pt.replace(
            "if (displayName.isEmpty())",
            """if (!isValidUsername(username)) {
            Toast.makeText(this, R.string.error_username_format, Toast.LENGTH_SHORT).show()
            return
        }
        if (displayName.isEmpty())"""
        )
        # before actual firestore set in saveProfile - async unique check
        # replace db.collection("users").document(uid).set(data with check
        if "checkUsernameUnique" not in pt.split("fun saveProfile")[1][:1500]:
            pt = re.sub(
                r'(private fun saveProfile\(uid: String\) \{[\s\S]*?)(tvSaveProfile\.isEnabled = false\s*\n\s*progressSave\.visibility = View\.VISIBLE)',
                r'''\1checkUsernameUnique(username, uid) { ok ->
            if (!ok) {
                Toast.makeText(this, R.string.error_username_format, Toast.LENGTH_SHORT).show()
                return@checkUsernameUnique
            }
            // unique ok - continue
            runOnUiThread {
                // fallthrough handled below
            }
        }
        // continue save after validation — simplified inline:
        checkUsernameUnique(username, uid) { unique ->
            if (!unique) {
                Toast.makeText(this, R.string.error_username_taken, Toast.LENGTH_SHORT).show()
                return@checkUsernameUnique
            }
        \2''',
                pt,
                count=1,
            )
            # This might break structure - simpler approach below
    # Simpler: inject at start of save after reading fields
    if "checkUsernameUnique(username, uid)" not in pt:
        old = """        if (displayName.isEmpty()) {
            Toast.makeText(this, getString(R.string.error_username_empty), Toast.LENGTH_SHORT).show()
            return
        }

        tvSaveProfile.isEnabled = false
        progressSave.visibility = View.VISIBLE

        val data = hashMapOf<String, Any>(
            "displayName" to displayName,
            "username" to username,
            "bio" to bio,
            "gender" to gender
        )

        db.collection("users").document(uid)
            .set(data, SetOptions.merge())
            .addOnSuccessListener {
                progressSave.visibility = View.GONE
                tvSaveProfile.isEnabled = true
                tvProfileAvatar.text = displayName.take(1).uppercase()
                Toast.makeText(this, getString(R.string.profile_updated), Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener { e ->
                progressSave.visibility = View.GONE
                tvSaveProfile.isEnabled = true
                Toast.makeText(this, e.message ?: getString(R.string.error_username_empty), Toast.LENGTH_SHORT).show()
            }
    }"""
        new = """        if (displayName.isEmpty()) {
            Toast.makeText(this, getString(R.string.error_username_empty), Toast.LENGTH_SHORT).show()
            return
        }
        if (!isValidUsername(username)) {
            Toast.makeText(this, R.string.error_username_format, Toast.LENGTH_SHORT).show()
            return
        }

        tvSaveProfile.isEnabled = false
        progressSave.visibility = View.VISIBLE

        checkUsernameUnique(username, uid) { unique ->
            if (!unique) {
                progressSave.visibility = View.GONE
                tvSaveProfile.isEnabled = true
                Toast.makeText(this, R.string.error_username_taken, Toast.LENGTH_SHORT).show()
                return@checkUsernameUnique
            }
            val data = hashMapOf<String, Any>(
                "displayName" to displayName,
                "username" to username,
                "bio" to bio,
                "gender" to gender
            )
            db.collection("users").document(uid)
                .set(data, SetOptions.merge())
                .addOnSuccessListener {
                    progressSave.visibility = View.GONE
                    tvSaveProfile.isEnabled = true
                    tvProfileAvatar.text = displayName.take(1).uppercase()
                    Toast.makeText(this, getString(R.string.profile_updated), Toast.LENGTH_SHORT).show()
                }
                .addOnFailureListener { e ->
                    progressSave.visibility = View.GONE
                    tvSaveProfile.isEnabled = true
                    Toast.makeText(this, e.message ?: getString(R.string.error_username_empty), Toast.LENGTH_SHORT).show()
                }
        }
    }"""
        if old in pt:
            pt = pt.replace(old, new)
            print("saveProfile replaced")
        else:
            print("saveProfile pattern mismatch - format check only")
            if "isValidUsername(username)" not in pt:
                pt = pt.replace(
                    "if (displayName.isEmpty())",
                    "if (!isValidUsername(username)) {\n            Toast.makeText(this, R.string.error_username_format, Toast.LENGTH_SHORT).show()\n            return\n        }\n        if (displayName.isEmpty())",
                    1,
                )

    print("Profile braces", pt.count("{"), pt.count("}"))
    if pt.count("{") == pt.count("}"):
        pp.write_text(pt)
        print("Profile SAVED")
    else:
        print("Profile BRACE_ABORT")
