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
import com.google.firebase.firestore.Query
import java.text.SimpleDateFormat
import java.util.Locale

class ReportsActivity : AppCompatActivity() {
    private val db by lazy { FirebaseFirestore.getInstance() }
    private lateinit var adapter: ReportsAdapter
    private val items = mutableListOf<Report>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_reports)
        findViewById<TextView>(R.id.tvBack).setOnClickListener { finish() }
        val rv = findViewById<RecyclerView>(R.id.rvReports)
        adapter = ReportsAdapter(items) { showActions(it) }
        rv.layoutManager = LinearLayoutManager(this)
        rv.adapter = adapter
        loadReports()
    }

    private fun loadReports() {
        db.collection("reports")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(100)
            .get()
            .addOnSuccessListener { snap ->
                items.clear()
                for (doc in snap.documents) {
                    val r = doc.toObject(Report::class.java) ?: continue
                    r.id = doc.id
                    items.add(r)
                }
                adapter.notifyDataSetChanged()
                findViewById<TextView>(R.id.tvReportsTitle).text = "البلاغات (${items.size})"
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, e.message ?: "فشل التحميل", Toast.LENGTH_LONG).show()
            }
    }

    private fun showActions(report: Report) {
        val options = arrayOf("حظر المبلَّغ عنه", "تجاهل البلاغ", "تعيين قيد المراجعة", "إلغاء")
        AlertDialog.Builder(this)
            .setTitle("بلاغ: ${report.reason}")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> banUser(report)
                    1 -> updateStatus(report, "dismissed")
                    2 -> updateStatus(report, "reviewed")
                }
            }.show()
    }

    private fun banUser(report: Report) {
        val uid = report.reportedUserId
        if (uid.isBlank()) {
            Toast.makeText(this, "لا يوجد معرف مستخدم", Toast.LENGTH_SHORT).show()
            return
        }
        val batch = db.batch()
        batch.set(
            db.collection("users").document(uid),
            mapOf(
                "banned" to true,
                "bannedReason" to report.reason,
                "bannedAt" to com.google.firebase.firestore.FieldValue.serverTimestamp()
            ),
            com.google.firebase.firestore.SetOptions.merge()
        )
        if (report.id.isNotBlank()) {
            batch.set(
                db.collection("reports").document(report.id),
                mapOf("status" to "banned"),
                com.google.firebase.firestore.SetOptions.merge()
            )
        }
        batch.commit()
            .addOnSuccessListener {
                Toast.makeText(this, "تم حظر المستخدم", Toast.LENGTH_SHORT).show()
                loadReports()
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, e.message ?: "فشل الحظر", Toast.LENGTH_LONG).show()
            }
    }

    private fun updateStatus(report: Report, status: String) {
        if (report.id.isBlank()) return
        db.collection("reports").document(report.id)
            .set(mapOf("status" to status), com.google.firebase.firestore.SetOptions.merge())
            .addOnSuccessListener {
                Toast.makeText(this, "تم التحديث", Toast.LENGTH_SHORT).show()
                loadReports()
            }
    }
}

class ReportsAdapter(
    private val items: List<Report>,
    private val onClick: (Report) -> Unit
) : RecyclerView.Adapter<ReportsAdapter.VH>() {
    private val fmt = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US)
    class VH(v: View) : RecyclerView.ViewHolder(v) {
        val title: TextView = v.findViewById(R.id.tvReportTitle)
        val sub: TextView = v.findViewById(R.id.tvReportSub)
        val status: TextView = v.findViewById(R.id.tvReportStatus)
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_report, parent, false)
        return VH(v)
    }
    override fun onBindViewHolder(holder: VH, position: Int) {
        val r = items[position]
        holder.title.text = r.reason.ifBlank { "بلاغ" }
        val time = r.createdAt?.let { fmt.format(it) } ?: "—"
        holder.sub.text = "على: ${r.reportedUserId.take(8)} | من: ${r.reporterId.take(8)} | $time"
        holder.status.text = r.status
        holder.itemView.setOnClickListener { onClick(r) }
    }
    override fun getItemCount() = items.size
}
