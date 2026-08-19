from pathlib import Path
p = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = p.read_text()
import re
# Replace any currentSenderName function
new = '''
    private var cachedSenderName: String? = null

    private fun currentSenderName(): String {
        val user = auth.currentUser ?: return "مستخدم"
        if (user.isAnonymous) return "ضيف"
        cachedSenderName?.let { return it }
        db.collection("users").document(user.uid).get()
            .addOnSuccessListener { snap ->
                val profile = snap.toObject(UserProfile::class.java)
                val name = profile?.bestName()?.takeIf { it.isNotBlank() && it != "مستخدم" }
                if (name != null) cachedSenderName = name
            }
        return cachedSenderName ?: "مستخدم"
    }
'''
pat = r'[ \t]*private fun currentSenderName\(\): String \{.*?\n[ \t]*\}'
t2, n = re.subn(pat, new.rstrip() + "\n", t, count=1, flags=re.S)
if n == 0:
    # try with cached already
    if "cachedSenderName" in t:
        print("ALREADY_PATCHED")
    else:
        print("NOT_FOUND")
else:
    # remove duplicate cachedSenderName if we double-added
    if t2.count("private var cachedSenderName") > 1:
        # keep first only - messy
        pass
    p.write_text(t2)
    print("PATCHED")
