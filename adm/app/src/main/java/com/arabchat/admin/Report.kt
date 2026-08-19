package com.arabchat.admin

import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

data class Report(
    var id: String = "",
    val reporterId: String = "",
    val reportedUserId: String = "",
    val reason: String = "",
    val details: String = "",
    val chatId: String = "",
    val messageId: String = "",
    val status: String = "new",
    @ServerTimestamp
    val createdAt: Date? = null
)
