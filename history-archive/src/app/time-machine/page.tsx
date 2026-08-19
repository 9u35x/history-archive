"use client";

import { useState } from "react";
import { events } from "@/data/events";
import { persons } from "@/data/persons";
import { battles } from "@/data/battles";
import Link from "next/link";
import { motion } from "framer-motion";

const KNOWN_SNAPSHOTS: Record<
  number,
  {
    world: string;
    note: string;
  }
> = {
  1187: {
    world:
      "في بلاد الشام ومصر: الدولة الأيوبية تحت صلاح الدين بعد حطين. في أوروبا: ممالك صليبية متراجعة. الخلافة العباسية قائمة في بغداد لكنها ضعيفة نسبيًا.",
    note: "معلومات عامة مستندة إلى السياق التاريخي المعروف.",
  },
  1258: {
    world:
      "سقوط بغداد على يد المغول بقيادة هولاكو. نهاية الخلافة العباسية في المدينة. الإمبراطورية المغولية في أوج توسعها. في مصر والشام: المماليك في صعود.",
    note: "من أكثر السنوات توثيقًا في المصادر الإسلامية والمغولية.",
  },
  1453: {
    world:
      "سقوط القسطنطينية على يد العثمانيين. نهاية الإمبراطورية البيزنطية. بداية مرحلة جديدة في تاريخ البحر المتوسط والبلقان.",
    note: "حدث مفصلي عالمي؛ التفاصيل الدقيقة خارج نطاق البيانات التجريبية الحالية.",
  },
};

export default function TimeMachinePage() {
  const [year, setYear] = useState(1258);
  const [input, setInput] = useState("1258");

  const snapshot = KNOWN_SNAPSHOTS[year];
  const yearEvents = events.filter((e) => Math.abs(e.year - year) <= 2);
  const yearBattles = battles.filter((b) => Math.abs(b.year - year) <= 2);
  const active = persons.filter((p) => {
    const b = typeof p.birthYear === "number" ? p.birthYear : -9999;
    const d = typeof p.deathYear === "number" ? p.deathYear : 9999;
    return b <= year && d >= year;
  });

  function go() {
    const y = parseInt(input, 10);
    if (!isNaN(y) && y >= -3000 && y <= 2100) setYear(y);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          آلة الزمن
        </h1>
        <p className="text-muted">أدخل سنة لاستكشاف ما نعرفه عن تلك الفترة من البيانات المتوفرة.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-5 py-3 rounded-xl bg-[#141416] border border-[rgba(201,162,39,0.3)] text-center text-lg focus:border-gold outline-none w-full sm:w-40"
          placeholder="السنة"
        />
        <button
          type="button"
          onClick={go}
          className="px-8 py-3 rounded-xl bg-gold text-[#0a0a0b] font-semibold hover:bg-gold-light transition-colors"
        >
          انتقل
        </button>
      </div>

      <motion.div
        key={year}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="glass rounded-2xl p-8 text-center glow-gold">
          <p className="text-sm text-muted mb-2">العام</p>
          <p className="text-5xl font-bold text-gold-gradient">{year} م</p>
        </div>

        {snapshot ? (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold mb-3">لمحة عن العالم</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">{snapshot.world}</p>
            <p className="text-xs text-muted">{snapshot.note}</p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-muted">
              لا تتوفر لمحة مفصلة لهذه السنة في البيانات التجريبية الحالية. جرّب 1187 أو 1258 أو
              1453.
            </p>
          </div>
        )}

        {(yearEvents.length > 0 || yearBattles.length > 0) && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold mb-3">أحداث ومعارك قريبة</h2>
            <ul className="space-y-2 text-sm">
              {yearEvents.map((e) => (
                <li key={e.id}>
                  <span className="text-gold">{e.year}</span> — {e.title}
                </li>
              ))}
              {yearBattles.map((b) => (
                <li key={b.id}>
                  <Link href={`/battles/${b.slug}`} className="hover:text-gold">
                    <span className="text-gold">{b.year}</span> — {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {active.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold mb-3">شخصيات معاصرة (من البيانات)</h2>
            <div className="flex flex-wrap gap-2">
              {active.map((p) => (
                <Link
                  key={p.id}
                  href={`/characters/${p.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm border border-[rgba(201,162,39,0.25)] hover:border-gold hover:text-gold transition-colors"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
