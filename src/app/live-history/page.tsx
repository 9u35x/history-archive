"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Choice = { id: string; label: string; result: string };

const SCENARIO = {
  title: "أنت قائد في القسطنطينية — 1453",
  intro:
    "الجيوش العثمانية تحاصر المدينة. الإمبراطور يطلب رأيك في الدفاع. اختر مسارًا — ثم قارن بما حدث تاريخيًا.",
  choices: [
    {
      id: "a",
      label: "أ) التركيز على تحصين الأسوار البرية وإرسال طلبات عاجلة للغرب",
      result:
        "هذا قريب مما حدث: اعتمد الدفاع بشكل كبير على الأسوار الشهيرة وطلب المساعدة من أوروبا. المساعدة جاءت محدودة ومتأخرة نسبيًا.",
    },
    {
      id: "b",
      label: "ب) محاولة هجوم مضاد بحري لكسر الحصار فورًا",
      result:
        "تاريخيًا لم يكن هناك هجوم مضاد بحري كبير ناجح يكسر الحصار بالكامل. السيطرة العثمانية على المضائق والبحر كانت عاملًا حاسمًا.",
    },
    {
      id: "c",
      label: "ج) التفاوض على تسليم مشروط مبكر لتجنب الدمار",
      result:
        "تاريخيًا استمر الدفاع حتى السقوط في مايو 1453. التفاوض النهائي لم يمنع الدخول العثماني. مصير المدينة تقرر عسكريًا.",
    },
  ] as Choice[],
  historical:
    "سقطت القسطنطينية في 29 مايو 1453 على يد محمد الفاتح. انتهى الحكم البيزنطي في المدينة. التفاصيل التكتيكية والدبلوماسية موثقة في مصادر متعددة (عثمانية وبيزنطية ولاتينية) مع اختلافات في الرواية.",
};

export default function LiveHistoryPage() {
  const [chosen, setChosen] = useState<Choice | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gold-gradient mb-3">عِش التاريخ</h1>
        <div className="inline-block px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-sm">
          تجربة تفاعلية — ميّز دائمًا بين التاريخ الحقيقي والسيناريو
        </div>
      </header>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-3">{SCENARIO.title}</h2>
        <p className="text-muted leading-relaxed mb-8">{SCENARIO.intro}</p>

        {!chosen ? (
          <div className="space-y-3">
            {SCENARIO.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChosen(c)}
                className="w-full text-right glass card-hover rounded-xl p-4 text-sm hover:border-gold/50 transition-all"
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-xl p-5 bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.25)]">
              <p className="text-xs text-gold mb-2">اختيارك</p>
              <p className="text-sm mb-3">{chosen.label}</p>
              <p className="text-sm text-muted">{chosen.result}</p>
            </div>

            <div className="rounded-xl p-5 border border-amber-500/30 bg-amber-500/5">
              <p className="text-xs text-amber-400 mb-2">ما حدث تاريخيًا</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{SCENARIO.historical}</p>
            </div>

            <button
              type="button"
              onClick={() => setChosen(null)}
              className="text-sm text-gold hover:underline"
            >
              إعادة الاختيار
            </button>
          </motion.div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        هذه ليست لعبة تاريخية كاملة. الهدف توضيح الفرق بين القرار التخيلي والحدث الموثق.
      </p>
    </div>
  );
}
