package com.arabchat.admin

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.firestore.FirebaseFirestore

class UsersActivity : AppCompatActivity() {
    private val db by lazy { FirebaseFirestore.getInstance() }
    private lateinit var adapter: UsersAdapter
    private val items = mutableListOf<AdminUser>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_users)
        findViewById<TextView>(R.id.tvBack).setOnClickListener { finish() }
        val rv = findViewById<RecyclerView>(R.id.rvUsers)
        adapter = UsersAdapter(items) { showUserActions(it) }
        rv.layoutManager = LinearLayoutManager(this)
        rv.adapter = adapter
        loadUsers()
    }

    private fun loadUsers() {
        db.collection("users").limit(200).get()
            .addOnSuccessListener { snap ->
                items.clear()
                for (doc in snap.documents) {
                    val u = doc.toObject(AdminUser::class.java) ?: AdminUser()
                    u.id = doc.id
                    items.add(u)
                }
                adapter.notifyDataSetChanged()
                findViewById<TextView>(R.id.tvUsersTitle).text = "المستخدمون (${items.size})"
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, e.message ?: "فشل", Toast.LENGTH_LONG).show()
            }
    }

    private fun showUserActions(user: AdminUser) {
        val label = if (user.banned) "إلغاء الحظر" else "حظر المستخدم"
        AlertDialog.Builder(this)
            .setTitle(user.displayName.ifBlank { user.username.ifBlank { user.id.take(8) } })
            .setMessage("بريد: ${user.email}\nمحظور: ${user.banned}")
            .setPositiveButton(label) { _, _ -> toggleBan(user) }
            .setNegativeButton("إغلاق", null)
            .show()
    }

    private fun toggleBan(user: AdminUser) {
        val newBanned = !user.banned
        db.collection("users").document(user.id)
            .set(
                mapOf(
                    "banned" to newBanned,
                    "bannedReason" to if (newBanned) "admin" else "",
                    "bannedAt" to if (newBanned)
                        com.google.firebase.firestore.FieldValue.serverTimestamp() else null
                ),
                com.google.firebase.firestore.SetOptions.merge()
            )
            .addOnSuccessListener {
                Toast.makeText(this, if (newBanned) "تم الحظر" else "تم إلغاء الحظر", Toast.LENGTH_SHORT).show()
                loadUsers()
            }
    }
}

class UsersAdapter(
    private val items: List<AdminUser>,
    private val onClick: (AdminUser) -> Unit
) : RecyclerView.Adapter<UsersAdapter.VH>() {
    class VH(v: View) : RecyclerView.ViewHolder(v) {
        val name: TextView = v.findViewById(R.id.tvUserName)
        val sub: TextView = v.findViewById(R.id.tvUserSub)
        val badge: TextView = v.findViewById(R.id.tvUserBadge)
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_user, parent, false)
        return VH(v)
    }
    override fun onBindViewHolder(holder: VH, position: Int) {
        val u = items[position]
        holder.name.text = u.displayName.ifBlank { u.username.ifBlank { "مستخدم" } }
        holder.sub.text = "@${u.username.ifBlank { "—" }} | ${u.email}"
        holder.badge.text = if (u.banned) "محظور" else "نشط"
        holder.itemView.setOnClickListener { onClick(u) }
    }
    override fun getItemCount() = items.size
}
