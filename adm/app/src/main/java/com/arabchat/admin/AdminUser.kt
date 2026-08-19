package com.arabchat.admin

data class AdminUser(
    var id: String = "",
    val username: String = "",
    val displayName: String = "",
    val email: String = "",
    val banned: Boolean = false,
    val bannedReason: String = "",
    val bio: String = ""
)
