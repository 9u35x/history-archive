from pathlib import Path
p = Path("app/src/main/java/com/arabchat/app/HomeActivity.kt")
t = p.read_text()

if "ChatNotifier.notifyNewMessage" in t:
    print("ALREADY")
else:
    # track last known lastMessage per chat to detect new ones
    if "private var lastNotified" not in t:
        t = t.replace(
            "private var allChats:",
            "private var lastNotified: MutableMap<String, String> = mutableMapOf()\n    private var allChats:",
            1,
        )
    # after allChats = ... sorted
    needle = "allChats = snapshot.documents.mapNotNull"
    if needle in t and "ChatNotifier.notifyNewMessage" not in t:
        # inject after allChats assignment block - find applyFilter after snapshot
        old = """                val q = findViewById<EditText>(R.id.etSearchChats).text?.toString().orEmpty()
                applyFilter(q)"""
        new = """                // Notify for new last messages
                val me = uid
                for (chat in allChats) {
                    val key = chat.id
                    val last = chat.lastMessage.orEmpty()
                    val prev = lastNotified[key]
                    if (prev != null && prev != last && last.isNotBlank()) {
                        // avoid notifying for my own sends if last message is from me - best effort
                        val title = chat.titleFor(me)
                        ChatNotifier.notifyNewMessage(this@HomeActivity, chat.id, title, last)
                    }
                    lastNotified[key] = last
                }
                val q = findViewById<EditText>(R.id.etSearchChats).text?.toString().orEmpty()
                applyFilter(q)"""
        if old in t:
            t = t.replace(old, new, 1)
            print("HOME_PATCHED")
        else:
            print("NEEDLE_FILTER_MISSING")
            p.write_text(t)
            raise SystemExit(0)
    p.write_text(t)
    print("braces", t.count("{"), t.count("}"))
