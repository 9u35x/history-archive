from pathlib import Path
import re

# --- HomeActivity: sync UnreadStore after loading chats ---
hp = Path("app/src/main/java/com/arabchat/app/HomeActivity.kt")
ht = hp.read_text()

if "UnreadStore.syncFromChats" not in ht:
    # after allChats = ... sorted
    patterns = [
        (
            r"(allChats = snapshot\.documents\.mapNotNull \{[\s\S]*?\}\.sortedWith\([\s\S]*?\))",
            r"\1\n                UnreadStore.syncFromChats(this@HomeActivity, uid, allChats)",
        ),
        (
            r"(allChats = snapshot\.documents\.mapNotNull \{[\s\S]*?\}\.sortedByDescending \{[^}]+\})",
            r"\1\n                UnreadStore.syncFromChats(this@HomeActivity, uid, allChats)",
        ),
    ]
    done = False
    for pat, repl in patterns:
        ht2, n = re.subn(pat, repl, ht, count=1)
        if n:
            ht = ht2
            done = True
            print("Home sync injected")
            break
    if not done:
        # fallback: before applyFilter(q) inside snapshot listener
        if "applyFilter(q)" in ht:
            ht = ht.replace(
                "applyFilter(q)",
                "UnreadStore.syncFromChats(this@HomeActivity, uid, allChats)\n                applyFilter(q)",
                1,
            )
            print("Home sync via applyFilter")
        else:
            print("HOME_INJECT_FAILED")

print("Home braces", ht.count("{"), ht.count("}"))
if ht.count("{") == ht.count("}"):
    hp.write_text(ht)
    print("Home SAVED")
else:
    print("Home BRACE_ABORT")

# --- ChatActivity: markRead on open + set lastMessageSenderId on send ---
cp = Path("app/src/main/java/com/arabchat/app/ChatActivity.kt")
ct = cp.read_text()

# mark read when opening
if "UnreadStore.markRead" not in ct:
    if "chatId = chatIdExtra" in ct:
        ct = ct.replace(
            "chatId = chatIdExtra",
            "chatId = chatIdExtra\n        UnreadStore.markRead(this, chatId)",
            1,
        )
        print("markRead on open")
    else:
        print("no chatIdExtra line")

# When updating lastMessage on chat, include lastMessageSenderId
# Common pattern: mapOf("lastMessage" to ...)
if "lastMessageSenderId" not in ct:
    # inject into maps that set lastMessage
    ct2, n = re.subn(
        r'("lastMessage"\s*to\s*[^,\n\)]+)',
        r'\1, "lastMessageSenderId" to (auth.currentUser?.uid ?: "")',
        ct,
    )
    ct = ct2
    print("lastMessageSenderId injects", n)

# Also after any message send success, update chat lastMessageSenderId
if 'chatRef.update' in ct or 'chatRef.set' in ct:
    pass

print("Chat braces", ct.count("{"), ct.count("}"))
if ct.count("{") == ct.count("}"):
    cp.write_text(ct)
    print("Chat SAVED")
else:
    print("Chat BRACE_ABORT")
