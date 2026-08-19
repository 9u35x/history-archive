from pathlib import Path
import re

p = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = p.read_text()

# Remove old broken versions of clear/bump if any (dedupe)
def remove_fun(src, name):
    pattern = rf"[ \t]*private fun {name}\(\)[^{{]*\{{"
    while True:
        m = re.search(pattern, src)
        if not m:
            break
        start = m.start()
        i = m.end() - 1
        depth = 0
        j = i
        while j < len(src):
            if src[j] == "{":
                depth += 1
            elif src[j] == "}":
                depth -= 1
                if depth == 0:
                    j += 1
                    break
            j += 1
        while j < len(src) and src[j] in "\r\n":
            j += 1
        src = src[:start] + src[j:]
    return src

t = remove_fun(t, "clearMyUnread")
t = remove_fun(t, "bumpUnreadForOthers")

fn = r'''
    private fun clearMyUnread() {
        val me = auth.currentUser?.uid ?: return
        chatRef.get().addOnSuccessListener { doc ->
            if (!doc.exists()) return@addOnSuccessListener
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
            if (!doc.exists()) return@addOnSuccessListener
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
            // also refresh lastMessageTime for list sort
            chatRef.set(
                mapOf(
                    "unreadCounts" to map,
                    "lastMessageTime" to com.google.firebase.firestore.FieldValue.serverTimestamp()
                ),
                com.google.firebase.firestore.SetOptions.merge()
            )
        }
    }
'''

idx = t.rfind("\n}")
t = t[:idx] + fn + t[idx:]

# Ensure clearMyUnread is called when chat opens
if t.count("clearMyUnread()") == 0:
    if "chatRef.get()" in t:
        t = t.replace("chatRef.get().addOnSuccessListener", "clearMyUnread()\n        chatRef.get().addOnSuccessListener", 1)
    elif "ChatNotifier.activeChatId = chatId" in t:
        t = t.replace("ChatNotifier.activeChatId = chatId", "ChatNotifier.activeChatId = chatId\n        clearMyUnread()", 1)
    else:
        t = t.replace("chatId = chatIdExtra", "chatId = chatIdExtra\n        // clear unread after init\n", 1)

# Always call clear once after messages listener registration area
if t.count("clearMyUnread()") == 0:
    t = t.replace(
        "private lateinit var chatId: String",
        "private lateinit var chatId: String",
        1,
    )

# Inject bumpUnreadForOthers after every messagesRef.add success
# Pattern: messagesRef.add( ... ).addOnSuccessListener {
# Insert bump as first line in success listeners that follow messagesRef.add

def inject_bump_after_messages_add(src):
    # find messagesRef.add and the following addOnSuccessListener {
    pattern = r'(messagesRef\.add\([\s\S]*?\)\s*\n?\s*\.addOnSuccessListener\s*\{)'
    def repl(m):
        block = m.group(1)
        if "bumpUnreadForOthers" in block:
            return block
        return block + "\n                bumpUnreadForOthers()"
    return re.sub(pattern, repl, src)

t2 = inject_bump_after_messages_add(t)
print("bump after messagesRef.add", t2.count("bumpUnreadForOthers()") - 1)  # minus definition
t = t2

# Also after .set( for message docs if used
if t.count("bumpUnreadForOthers()") < 2:
    t = t.replace(
        'etMessage.text?.clear()',
        'bumpUnreadForOthers()\n                etMessage.text?.clear()',
        1,
    )
    print("fallback etMessage inject")

print("braces", t.count("{"), t.count("}"))
print("clearFn", t.count("fun clearMyUnread"))
print("bumpFn", t.count("fun bumpUnreadForOthers"))
print("clearCall", t.count("clearMyUnread()"))
print("bumpCall", t.count("bumpUnreadForOthers()"))
if t.count("{") != t.count("}"):
    print("BRACE_ABORT")
else:
    p.write_text(t)
    print("SAVED")
