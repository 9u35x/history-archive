'use client';

import { motion } from 'framer-motion';
import { Parallax } from 'react-parallax';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* خلفية متحركة سينمائية */}
      <Parallax
        bgImage="https://picsum.photos/id/1015/2000/1200" // يمكنك تغيير الصورة لاحقاً بصورة تاريخية
        strength={200}
        className="absolute inset-0 z-0"
      />

      {/* مؤثر ضوء تاريخي خفيف */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/10 to-transparent z-10" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">A</div>
            <div>
              <span className="text-2xl font-bold tracking-tighter">أرشيف التاريخ</span>
              <span className="text-amber-400 text-sm ml-2">History Archive</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-lg">
            <a href="#characters" className="hover:text-amber-400 transition">الشخصيات</a>
            <a href="#timeline" className="hover:text-amber-400 transition">الخط الزمني</a>
            <a href="#map" className="hover:text-amber-400 transition">الخريطة</a>
            <a href="#battles" className="hover:text-amber-400 transition">الحروب</a>
            <a href="#narratives" className="hover:text-amber-400 transition">الروايات</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في الأرشيف..."
                className="bg-black/70 border border-amber-500/30 rounded-full px-6 py-2.5 w-72 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <button className="bg-amber-500 hover:bg-amber-400 transition px-8 py-2.5 rounded-full font-medium">
              ابدأ الرحلة
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section سينمائي */}
      <div className="relative min-h-screen flex items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6"
          >
            التاريخ ليس مجرد سنوات...<br />
            <span className="text-amber-400">إنه قرارات غيّرت العالم.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl text-amber-100/90 max-w-2xl mx-auto mb-12"
          >
            استكشف حياة القادة، صعود الإمبراطوريات، سقوط الممالك، المعارك التي غيّرت التاريخ، والأحداث التي صنعت عالمنا.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 shadow-2xl shadow-amber-500/50"
            >
              ابدأ الرحلة
            </button>
            <button
              onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-amber-400 hover:bg-amber-400/10 font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300"
            >
              استكشف الخريطة
            </button>
            <button
              onClick={() => document.getElementById('characters')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-amber-400 hover:bg-amber-400/10 font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300"
            >
              استكشف الشخصيات
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="text-amber-400 text-sm tracking-widest mb-2">SCROLL</div>
            <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-2 bg-amber-400 rounded-full animate-scroll" />
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism cards preview */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "الشخصيات", desc: "أكثر من 50 قائد وملك وعالم", color: "amber" },
            { title: "الحروب", desc: "معارك غيّرت التاريخ", color: "rose" },
            { title: "الروايات", desc: "مقارنة المصادر والروايات", color: "emerald" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-amber-400/50 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-\( {item.color}-500 to- \){item.color}-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {i === 0 ? "👑" : i === 1 ? "⚔️" : "📜"}
              </div>
              <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
              <p className="text-amber-100/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
