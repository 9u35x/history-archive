from pathlib import Path
import re

# ---- Chat.kt robust ----
Path("app/src/main/java/com/arabchat/app/Chat.kt").write_text("""package com.arabchat.app

import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

data class Chat(
    var id: String = "",
    val type: String = "direct",
    val name: String? = null,
    val description: String? = null,
    val avatarUrl: String? = null,
    val participants: List<String> = emptyList(),
    val participantNames: Map<String, String> = emptyMap(),
    val admins: List<String> = emptyList(),
    val lastMessage: String = "",
    val lastMessageSenderId: String = "",
    val unreadCounts: Map<String, Any>? = null,
    @ServerTimestamp
    val lastMessageTime: Date? = null
) {
    fun titleFor(currentUid: String): String {
        return when (type) {
            "group" -> name ?: "مجموعة"
            "channel" -> name ?: "قناة"
            else -> {
                val otherUid = participants.firstOrNull { it != currentUid }
                participantNames[otherUid] ?: "محادثة"
            }
        }
    }

    fun unreadFor(uid: String): Int {
        val v = unreadCounts?.get(uid) ?: return 0
        return when (v) {
            is Number -> v.toInt().coerceAtLeast(0)
            is String -> v.toIntOrNull()?.coerceAtLeast(0) ?: 0
            else -> 0
        }
    }

    fun isChannel(): Boolean = type == "channel"
    fun isGroup(): Boolean = type == "group"
}
""")
print("Chat.kt written")

# ---- ChatActivity: replace clear/bump with FieldValue.increment ----
p = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = p.read_text()

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

# remove orphaned calls temporarily ok

fn = r'''
    private fun clearMyUnread() {
        val me = auth.currentUser?.uid ?: return
        chatRef.update(mapOf("unreadCounts.$me" to 0))
            .addOnFailureListener {
                chatRef.set(mapOf("unreadCounts" to mapOf(me to 0)), com.google.firebase.firestore.SetOptions.merge())
            }
    }

    private fun bumpUnreadForOthers() {
        val me = auth.currentUser?.uid ?: return
        // Prefer in-memory participants if available
        val parts = try {
            val f = this::class.java.getDeclaredField("participantIds")
            f.isAccessible = true
            @Suppress("UNCHECKED_CAST")
            (f.get(this) as? List<String>) ?: emptyList()
        } catch (_: Exception) {
            emptyList()
        }
        if (parts.isNotEmpty()) {
            val updates = hashMapOf<String, Any>(
                "lastMessageSenderId" to me
            )
            for (uid in parts) {
                if (uid != me) {
                    updates["unreadCounts.$uid"] = com.google.firebase.firestore.FieldValue.increment(1)
                }
            }
            chatRef.update(updates)
            return
        }
        chatRef.get().addOnSuccessListener { doc ->
            val list = (doc.get("participants") as? List<*>)?.mapNotNull { it as? String } ?: emptyList()
            val updates = hashMapOf<String, Any>("lastMessageSenderId" to me)
            for (uid in list) {
                if (uid != me) {
                    updates["unreadCounts.$uid"] = com.google.firebase.firestore.FieldValue.increment(1)
                }
            }
            chatRef.update(updates)
        }
    }
'''
# Fix Kotlin string interpolation in the written file - unreadCounts.$me must be real
fn = """
    private fun clearMyUnread() {
        val me = auth.currentUser?.uid ?: return
        chatRef.update(mapOf(\"unreadCounts.${'$'}me\" to 0))
            .addOnFailureListener {
                chatRef.set(mapOf(\"unreadCounts\" to mapOf(me to 0)), com.google.firebase.firestore.SetOptions.merge())
            }
    }

    private fun bumpUnreadForOthers() {
        val me = auth.currentUser?.uid ?: return
        chatRef.get().addOnSuccessListener { doc ->
            val list = (doc.get(\"participants\") as? List<*>)?.mapNotNull { it as? String } ?: emptyList()
            val updates = hashMapOf<String, Any>(
                \"lastMessageSenderId\" to me
            )
            for (uid in list) {
                if (uid != me) {
                    updates[\"unreadCounts.${'$'}uid\"] = com.google.firebase.firestore.FieldValue.increment(1)
                }
            }
            if (updates.size > 1) {
                chatRef.update(updates)
            }
        }
    }
"""

idx = t.rfind("\n}")
t = t[:idx] + "\n" + fn + t[idx:]

# Ensure clear called on open
if "clearMyUnread()" not in t:
    if "chatRef.get()" in t:
        t = t.replace("chatRef.get().addOnSuccessListener", "clearMyUnread()\n        chatRef.get().addOnSuccessListener", 1)
    else:
        t = t.replace("chatId = chatIdExtra", "chatId = chatIdExtra\n", 1)

# Inject bump into ALL success paths after sending
# 1) messagesRef.add success
t = re.sub(
    r'(messagesRef\.add\([\s\S]{0,800}?\.addOnSuccessListener\s*\{)',
    lambda m: m.group(1) if "bumpUnreadForOthers" in m.group(1) else m.group(1) + "\n                bumpUnreadForOthers()",
    t,
)

# 2) after updating lastMessage on chat
if "lastMessage" in t and "bumpUnreadForOthers()" in t:
    pass

# 3) etMessage clear
if t.count("bumpUnreadForOthers()") < 2:
    t = t.replace(
        "etMessage.text?.clear()",
        "bumpUnreadForOthers()\n                etMessage.text?.clear()",
        1,
    )

# 4) also when chatRef.update lastMessage
t = re.sub(
    r'(chatRef\.(?:update|set)\([^\)]*lastMessage[\s\S]{0,200}?\))',
    r'\1',
    t,
)

print("ChatActivity braces", t.count("{"), t.count("}"))
print("bumpCall", t.count("bumpUnreadForOthers()"))
print("clearCall", t.count("clearMyUnread()"))
if t.count("{") == t.count("}"):
    p.write_text(t)
    print("ChatActivity SAVED")
else:
    print("ChatActivity BRACE_ABORT")

# ---- HomeActivity: manual parse unreadCounts from snapshot ----
hp = Path("app/src/main/java/com/arabchat/app/HomeActivity.kt")
ht = hp.read_text()

# Replace toObject mapping with enhanced mapping if present
old_map = """allChats = snapshot.documents.mapNotNull { doc ->
                    doc.toObject(Chat::class.java)?.also { it.id = doc.id }
                }"""
new_map = """allChats = snapshot.documents.mapNotNull { doc ->
                    doc.toObject(Chat::class.java)?.also { chat ->
                        chat.id = doc.id
                    }
                }"""
# Actually toObject should work with Map<String,Any> - problem might be unreadCounts type in firestore

# Add explicit merge of unreadCounts from raw data
new_map = """allChats = snapshot.documents.mapNotNull { doc ->
                    val chat = doc.toObject(Chat::class.java) ?: return@mapNotNull null
                    chat.id = doc.id
                    chat
                }"""

if "toObject(Chat::class.java)" in ht:
    # inject after mapping - parse unread from doc data into a parallel approach
    # Force re-read: copy chat with unread from document
    ht2 = re.sub(
        r'doc\.toObject\(Chat::class\.java\)\?\.also\s*\{\s*it\.id\s*=\s*doc\.id\s*\}',
        '''doc.toObject(Chat::class.java)?.also { c ->
                        c.id = doc.id
                    }''',
        ht,
        count=1,
    )
    if ht2 == ht:
        ht2 = re.sub(
            r'doc\.toObject\(Chat::class\.java\)\?\.apply\s*\{\s*id\s*=\s*doc\.id\s*\}',
            '''doc.toObject(Chat::class.java)?.also { c ->
                        c.id = doc.id
                    }''',
            ht,
            count=1,
        )
    ht = ht2
    print("Home mapping touched")
else:
    print("Home toObject pattern different")

# Sort unread chats to top optionally
if "sortedByDescending" in ht and "unreadFor" not in ht:
    ht = ht.replace(
        ".sortedByDescending { it.lastMessageTime?.time ?: 0L }",
        """.sortedWith(
                    compareByDescending<Chat> { it.unreadFor(uid) > 0 }
                        .thenByDescending { it.lastMessageTime?.time ?: 0L }
                )"""
    )
    print("sort with unread")

print("Home braces", ht.count("{"), ht.count("}"))
if ht.count("{") == ht.count("}"):
    hp.write_text(ht)
    print("Home SAVED")
else:
    print("Home BRACE_ABORT")
