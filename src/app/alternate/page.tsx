"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = [
  {
    id: "no-soviet-collapse",
    title: "ماذا لو لم يسقط الاتحاد السوفيتي؟",
    premise:
      "سيناريو افتراضي يفترض استمرار الاتحاد السوفيتي بعد 1991 دون الانهيار الذي حدث تاريخيًا.",
    timeline: [
      { year: "1991+", text: "استمرار الهيكل السياسي والاقتصادي السوفيتي مع إصلاحات محدودة محتملة." },
      { year: "2000s", text: "منافسة مستمرة مع الغرب؛ تأثير مختلف على أوروبا الشرقية والشرق الأوسط." },
      { year: "اليوم", text: "عالم ثنائي القطب أو متعدد الأقطاب بشكل مختلف — كل هذا تخمين." },
    ],
  },
  {
    id: "napoleon-waterloo",
    title: "ماذا لو انتصر نابليون في واترلو؟",
    premise:
      "افتراض انتصار فرنسي في 1815 بدل الهزيمة التاريخية.",
    timeline: [
      { year: "1815", text: "بقاء نابليون في السلطة لفترة أطول محتملة." },
      { year: "بعدها", text: "خريطة أوروبا قد تختلف؛ تأثير على الاستعمار والثورات اللاحقة غير مؤكد." },
      { year: "بعيد", text: "أي سلسلة أحداث طويلة الأمد تبقى في نطاق الخيال التاريخي." },
    ],
  },
  {
    id: "no-ww1",
    title: "ماذا لو لم تحدث الحرب العالمية الأولى؟",
    premise: "سيناريو يفترض تجنب اندلاع الحرب عام 1914.",
    timeline: [
      { year: "1914+", text: "استمرار الإمبراطوريات الأوروبية الكبرى لفترة أطول." },
      { year: "القرن 20", text: "مسارات مختلفة للشيوعية والفاشية والاستعمار — كلها افتراضات." },
    ],
  },
];

export default function AlternatePage() {
  const [active, setActive] = useState<string | null>(null);
  const scenario = SCENARIOS.find((s) => s.id === active);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          التاريخ البديل — ماذا لو؟
        </h1>
        <div className="inline-block px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-sm mb-4">
          هذا سيناريو تاريخي افتراضي وليس حقيقة تاريخية
        </div>
        <p className="text-muted max-w-2xl mx-auto">
          استكشافات تخيلية. لا تُقدم كنتائج مؤكدة أو تنبؤات علمية.
        </p>
      </header>

      <div className="grid gap-4 mb-10">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(active === s.id ? null : s.id)}
            className={`text-right glass rounded-2xl p-5 transition-all ${
              active === s.id ? "border-gold/50 glow-gold" : "card-hover"
            }`}
          >
            <h2 className="font-semibold text-lg">{s.title}</h2>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {scenario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 sm:p-8 overflow-hidden"
          >
            <div className="mb-4 px-3 py-1.5 rounded bg-amber-500/10 text-amber-400 text-xs inline-block">
              خيال تاريخي — ليس حقيقة
            </div>
            <p className="text-muted mb-6 leading-relaxed">{scenario.premise}</p>
            <div className="space-y-4 border-r-2 border-[rgba(201,162,39,0.3)] pr-6">
              {scenario.timeline.map((t, i) => (
                <div key={i} className="relative">
                  <div className="absolute -right-[31px] top-1 w-3.5 h-3.5 rounded-full bg-gold/80" />
                  <p className="text-gold text-sm font-medium mb-1">{t.year}</p>
                  <p className="text-sm text-foreground/85">{t.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted border-t border-[rgba(201,162,39,0.15)] pt-4">
              أي استنتاجات طويلة الأمد تبقى تخمينية. التاريخ الفعلي معقد ولا يمكن اختزاله في
              سيناريو واحد.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
