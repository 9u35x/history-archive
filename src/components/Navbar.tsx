export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-3xl">A</div>
          <span className="text-3xl font-bold tracking-tighter">أرشيف التاريخ</span>
        </div>

        <div className="flex gap-10 text-lg">
          <a href="#timeline" className="hover:text-amber-400 transition">الخط الزمني</a>
          <a href="#map" className="hover:text-amber-400 transition">الخريطة</a>
          <a href="#characters" className="hover:text-amber-400 transition">الشخصيات</a>
          <a href="#battles" className="hover:text-amber-400 transition">الحروب</a>
        </div>

        <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-3 rounded-2xl transition">
          ابدأ الرحلة
        </button>
      </div>
    </nav>
  );
}
