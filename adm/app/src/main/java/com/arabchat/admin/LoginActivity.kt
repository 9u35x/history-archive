package com.arabchat.admin

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth

class LoginActivity : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        auth = FirebaseAuth.getInstance()

        val current = auth.currentUser
        if (current != null && AdminConfig.isAdminEmail(current.email)) {
            goHome(); return
        } else if (current != null) {
            auth.signOut()
        }

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val tvLogin = findViewById<TextView>(R.id.tvLogin)

        tvLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "أدخل البريد وكلمة المرور", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (!AdminConfig.isAdminEmail(email)) {
                Toast.makeText(this, "هذا الحساب ليس حساب إدارة", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            tvLogin.isEnabled = false
            auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener { task ->
                    tvLogin.isEnabled = true
                    if (task.isSuccessful && AdminConfig.isAdminEmail(auth.currentUser?.email)) {
                        goHome()
                    } else {
                        auth.signOut()
                        Toast.makeText(this, task.exception?.localizedMessage ?: "فشل الدخول", Toast.LENGTH_LONG).show()
                    }
                }
        }
    }

    private fun goHome() {
        startActivity(Intent(this, AdminHomeActivity::class.java))
        finish()
    }
}
