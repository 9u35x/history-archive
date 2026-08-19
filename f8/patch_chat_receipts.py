from pathlib import Path
import re

p = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
t = p.read_text()

# activeChatId
if "ChatNotifier.activeChatId" not in t:
    t = t.replace(
        "setContentView(R.layout.activity_chat)",
        "setContentView(R.layout.activity_chat)\n        ChatNotifier.ensureChannel(this)",
        1,
    )
    t = t.replace(
        "chatId = chatIdExtra",
        "chatId = chatIdExtra\n        ChatNotifier.activeChatId = chatId",
        1,
    )
    if "override fun onDestroy" in t:
        t = t.replace(
            "override fun onDestroy() {",
            "override fun onDestroy() {\n        if (ChatNotifier.activeChatId == chatId) ChatNotifier.activeChatId = null",
            1,
        )
    else:
        fn = """
    override fun onDestroy() {
        if (ChatNotifier.activeChatId == chatId) ChatNotifier.activeChatId = null
        super.onDestroy()
    }
"""
        idx = t.rfind("\n}")
        t = t[:idx] + fn + t[idx:]

# markMessagesRead
if "fun markMessagesRead" not in t:
    fn = """
    private fun markMessagesRead(messages: List<Message>) {
        val me = auth.currentUser?.uid ?: return
        for (m in messages) {
            if (m.senderId != me && m.id.isNotEmpty() && m.status != "read") {
                messagesRef.document(m.id).update("status", "read")
            }
        }
    }
"""
    idx = t.rfind("\n}")
    t = t[:idx] + fn + t[idx:]

if "markMessagesRead(messages)" not in t:
    t = t.replace(
        "adapter.submitList(messages)",
        "adapter.submitList(messages)\n                markMessagesRead(messages)",
        1,
    )

# status on send
if '"status" to "sent"' not in t:
    t = re.sub(r'("type" to "text")', r'\1, "status" to "sent"', t)
    t = re.sub(r'("type" to "image")', r'\1, "status" to "sent"', t)
    t = re.sub(r'("type" to "voice")', r'\1, "status" to "sent"', t)

print("braces", t.count("{"), t.count("}"))
print("markRead", t.count("fun markMessagesRead"))
print("status sends", t.count('"status" to "sent"'))
if t.count("{") == t.count("}"):
    p.write_text(t)
    print("SAVED")
else:
    print("BRACE_ABORT")
