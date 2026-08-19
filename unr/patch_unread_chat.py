from pathlib import Path
import re

p = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = p.read_text()

if "fun clearMyUnread" not in t:
    fn = r'''
    private fun clearMyUnread() {
        val me = auth.currentUser?.uid ?: return
        chatRef.get().addOnSuccessListener { doc ->
            val map = (doc.get("unreadCounts") as? Map<*, *>)
                ?.mapKeys { it.key.toString() }
                ?.mapValues { (it.value as? Number)?.toInt() ?: 0 }
                ?.toMutableMap() ?: mutableMapOf()
            map[me] = 0
            chatRef.set(mapOf("unreadCounts" to map), com.google.firebase.firestore.SetOptions.merge())
        }
    }

    private fun bumpUnreadForOthers() {
        val me = auth.currentUser?.uid ?: return
        chatRef.get().addOnSuccessListener { doc ->
            val parts = (doc.get("participants") as? List<*>)?.mapNotNull { it as? String } ?: emptyList()
            val map = (doc.get("unreadCounts") as? Map<*, *>)
                ?.mapKeys { it.key.toString() }
                ?.mapValues { (it.value as? Number)?.toInt() ?: 0 }
                ?.toMutableMap() ?: mutableMapOf()
            for (uid in parts) {
                if (uid != me) {
                    map[uid] = (map[uid] ?: 0) + 1
                }
            }
            chatRef.set(mapOf("unreadCounts" to map), com.google.firebase.firestore.SetOptions.merge())
        }
    }
'''
    idx = t.rfind("\n}")
    t = t[:idx] + fn + t[idx:]

if "clearMyUnread()" not in t:
    if "chatRef.get()" in t:
        t = t.replace(
            "chatRef.get().addOnSuccessListener",
            "clearMyUnread()\n        chatRef.get().addOnSuccessListener",
            1,
        )
    elif "listenForMessages()" in t:
        t = t.replace("listenForMessages()", "clearMyUnread()\n        listenForMessages()", 1)
    else:
        t = t.replace(
            "ChatNotifier.activeChatId = chatId",
            "ChatNotifier.activeChatId = chatId\n        clearMyUnread()",
            1,
        )
        if "clearMyUnread()" not in t:
            t = t.replace(
                "chatId = chatIdExtra",
                "chatId = chatIdExtra\n        // clearMyUnread after refs ready",
                1,
            )

# bump after text send success - common patterns
if "bumpUnreadForOthers()" not in t:
    # after any addOnSuccessListener that clears etMessage
    t2, n = re.subn(
        r'(\.addOnSuccessListener\s*\{\s*\n\s*)(etMessage\.text)',
        r'\1bumpUnreadForOthers()\n                \2',
        t,
        count=1,
    )
    t = t2
    print("bump after et clear", n)
    # image/voice: after messagesRef.add success more generically
    if "bumpUnreadForOthers()" not in t:
        t = t.replace(
            'Toast.makeText(this, R.string.message_deleted',
            'bumpUnreadForOthers()\n                Toast.makeText(this, R.string.message_deleted',
            0,
        )
    # force at least one call site near sendTextMessage success
    if t.count("bumpUnreadForOthers()") < 2:
        # insert into sendTextMessage success if found
        if "private fun sendTextMessage" in t:
            m = re.search(r'private fun sendTextMessage[\s\S]*?messagesRef\.add[\s\S]*?\.addOnSuccessListener\s*\{', t)
            if m:
                pos = m.end()
                t = t[:pos] + "\n                bumpUnreadForOthers()" + t[pos:]
                print("inserted in sendTextMessage")

print("braces", t.count("{"), t.count("}"))
print("clearFn", t.count("fun clearMyUnread"))
print("bumpFn", t.count("fun bumpUnreadForOthers"))
print("clearCall", t.count("clearMyUnread()"))
print("bumpCall", t.count("bumpUnreadForOthers()"))
if t.count("{") == t.count("}"):
    p.write_text(t)
    print("SAVED")
else:
    print("BRACE_ABORT")
