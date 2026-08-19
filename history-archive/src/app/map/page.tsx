"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { battles } from "@/data/battles";

// Leaflet needs dynamic import to avoid SSR issues
const MapView = dynamic(() => import("@/components/HistoricalMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] glass rounded-2xl flex items-center justify-center text-muted">
      جاري تحميل الخريطة...
    </div>
  ),
});

const DEMO_YEARS = [1187, 1258, 1453];

export default function MapPage() {
  const [year, setYear] = useState(1258);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          الخريطة التاريخية
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          نسخة أولية: علامات للمعارك والأحداث المسجلة. الخرائط التاريخية الكاملة للحدود تحتاج
          بيانات GeoJSON متخصصة من مصادر أكاديمية.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {DEMO_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              year === y
                ? "bg-gold text-[#0a0a0b]"
                : "glass text-muted hover:text-gold"
            }`}
          >
            {y} م
          </button>
        ))}
      </div>

      <MapView year={year} battles={battles} />

      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gold mb-3">ملاحظات حول الخريطة</h2>
        <ul className="text-sm text-muted space-y-2 list-disc list-inside">
          <li>لا تُعرض حدود الدول التاريخية بدقة في هذه النسخة لعدم توفر بيانات GIS موثوقة مجانية جاهزة.</li>
          <li>العلامات تشير إلى مواقع معارك مسجلة في البيانات.</li>
          <li>للتوسع: يمكن دمج مشاريع مثل Historical GIS أو خرائط من مؤسسات أكاديمية.</li>
          <li>لا نختلق مواقع أو حدود غير موثقة.</li>
        </ul>
      </div>
    </div>
  );
}
