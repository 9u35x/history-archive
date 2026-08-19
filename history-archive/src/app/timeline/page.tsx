"use client";

import { useState, useMemo } from "react";
import { events } from "@/data/events";
import { persons } from "@/data/persons";
import { battles } from "@/data/battles";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const YEARS = [1000, 1100, 1187, 1200, 1258, 1300, 1400, 1453, 1500, 1600, 1700, 1800, 1900, 2000, 2026];

export default function TimelinePage() {
  const [selectedYear, setSelectedYear] = useState(1258);

  const yearEvents = useMemo(() => {
    return events.filter((e) => Math.abs(e.year - selectedYear) <= 5);
  }, [selectedYear]);

  const yearBattles = useMemo(() => {
    return battles.filter((b) => Math.abs(b.year - selectedYear) <= 5);
  }, [selectedYear]);

  const activePersons = useMemo(() => {
    return persons.filter((p) => {
      const birth = typeof p.birthYear === "number" ? p.birthYear : 0;
      const death = typeof p.deathYear === "number" ? p.deathYear : 9999;
      return birth <= selectedYear && death >= selectedYear;
    });
  }, [selectedYear]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          الخط الزمني التاريخي
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          اختر سنة لعرض الأحداث والشخصيات والمعارك المرتبطة. البيانات التجريبية محدودة.
        </p>
      </header>

      <div className="mb-12 overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-max justify-center px-2">
          {YEARS.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedYear === y
                  ? "bg-gold text-[#0a0a0b] scale-105 glow-gold"
                  : "glass text-muted hover:text-gold hover:border-gold/40"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 max-w-xl mx-auto">
        <input
          type="range"
          min={1000}
          max={2026}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full accent-[#c9a227] h-2 rounded-full appearance-none bg-[#2a261c] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted mt-2">
          <span>1000</span>
          <span className="text-gold font-bold text-lg">{selectedYear} م</span>
          <span>2026</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">الأحداث</h2>
            {yearEvents.length === 0 ? (
              <p className="text-sm text-muted">لا توجد أحداث مسجلة في البيانات الحالية لهذه الفترة.</p>
            ) : (
              <ul className="space-y-3">
                {yearEvents.map((e) => (
                  <li key={e.id} className="text-sm">
                    <span className="text-gold">{e.year}</span> — {e.title}
                    <p className="text-muted text-xs mt-0.5 line-clamp-2">{e.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">المعارك</h2>
            {yearBattles.length === 0 ? (
              <p className="text-sm text-muted">لا توجد معارك مسجلة في البيانات الحالية.</p>
            ) : (
              <ul className="space-y-3">
                {yearBattles.map((b) => (
                  <li key={b.id}>
                    <Link href={`/battles/${b.slug}`} className="text-sm hover:text-gold">
                      <span className="text-gold">{b.year}</span> — {b.name}
                    </Link>
                    <p className="text-muted text-xs mt-0.5 line-clamp-2">{b.outcome}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">شخصيات معاصرة</h2>
            {activePersons.length === 0 ? (
              <p className="text-sm text-muted">لا توجد شخصيات مسجلة في البيانات لهذه السنة.</p>
            ) : (
              <ul className="space-y-3">
                {activePersons.map((p) => (
                  <li key={p.id}>
                    <Link href={`/characters/${p.slug}`} className="text-sm hover:text-gold">
                      {p.name}
                    </Link>
                    <p className="text-muted text-xs">{p.role}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-12 text-center text-xs text-muted">
        ملاحظة: هذه النسخة تستخدم بيانات تجريبية محدودة. السنوات الأخرى ستظهر فارغة حتى تُضاف
        المزيد من الأحداث.
      </p>
    </div>
  );
}
