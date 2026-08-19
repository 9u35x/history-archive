package com.arabchat.admin

/**
 * حسابان إدارة — غيّر إلى إيميلاتك الحقيقية.
 */
object AdminConfig {
    val ADMIN_EMAILS = setOf(
        "admin1@example.com",
        "admin2@example.com"
    )

    fun isAdminEmail(email: String?): Boolean {
        if (email.isNullOrBlank()) return false
        return ADMIN_EMAILS.any { it.equals(email.trim(), ignoreCase = true) }
    }
}
