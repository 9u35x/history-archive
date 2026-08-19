export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-8 text-center">
        عن أرشيف التاريخ
      </h1>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-3">الرؤية</h2>
          <p>
            بناء منصة تاريخية تفاعلية حديثة تجمع الشخصيات والأحداث والمعارك والخرائط والخطوط
            الزمنية في تجربة أقرب إلى المتحف الرقمي منها إلى الموسوعة التقليدية.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-3">المبادئ</h2>
          <ul className="space-y-2 list-disc list-inside text-muted">
            <li>لا اختراع لمعلومات تاريخية أو مصادر.</li>
            <li>إظهار المراجع بوضوح.</li>
            <li>التمييز بين الحقيقة المتفق عليها والتفسير والخيال.</li>
            <li>الشفافية عند عدم اليقين أو اختلاف المصادر.</li>
            <li>تصميم فاخر وسريع ومتجاوب.</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-3">النسخة الحالية</h2>
          <p className="text-muted">
            هذه نسخة أولية (MVP) ببيانات تجريبية محدودة وموثوقة قدر الإمكان (صلاح الدين، سقوط
            بغداد 1258، حطين...). الهيكل جاهز لإضافة آلاف الشخصيات والأحداث لاحقًا.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-3">التقنية</h2>
          <p className="text-muted">
            Next.js · TypeScript · Tailwind CSS · Framer Motion · Leaflet · هيكل بيانات قابل
            للتوسع.
          </p>
        </section>
      </div>
    </div>
  );
}
