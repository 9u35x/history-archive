package com.arabchat.admin

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class AdminHomeActivity : AppCompatActivity() {
    private val auth by lazy { FirebaseAuth.getInstance() }
    private val db by lazy { FirebaseFirestore.getInstance() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_home)

        val email = auth.currentUser?.email
        if (!AdminConfig.isAdminEmail(email)) {
            Toast.makeText(this, "جلسة غير مصرح بها", Toast.LENGTH_LONG).show()
            auth.signOut()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }

        findViewById<TextView>(R.id.tvAdminEmail).text = "أدمن: $email"
        findViewById<TextView>(R.id.tvOpenReports).setOnClickListener {
            startActivity(Intent(this, ReportsActivity::class.java))
        }
        findViewById<TextView>(R.id.tvOpenUsers).setOnClickListener {
            startActivity(Intent(this, UsersActivity::class.java))
        }
        findViewById<TextView>(R.id.tvLogout).setOnClickListener {
            auth.signOut()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        val tvNewCount = findViewById<TextView>(R.id.tvNewReportsCount)
        db.collection("reports").whereEqualTo("status", "new").get()
            .addOnSuccessListener { tvNewCount.text = "بلاغات جديدة: ${it.size()}" }
            .addOnFailureListener { tvNewCount.text = "بلاغات جديدة: —" }
    }
}
