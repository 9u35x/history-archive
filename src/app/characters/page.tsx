import Link from "next/link";
import { persons } from "@/data/persons";
import type { Category } from "@/types";

const categories: Category[] = [
  "قادة",
  "ملوك",
  "رؤساء",
  "علماء",
  "فلاسفة",
  "شعراء",
  "شخصيات عسكرية",
  "مستكشفون",
  "شخصيات مؤثرة",
];

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          الشخصيات التاريخية
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          بطاقات لشخصيات مختارة. البيانات محدودة في هذه النسخة الأولية وقابلة للتوسع.
        </p>
      </header>

      {/* Categories filter (static for now) */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <span className="px-4 py-1.5 rounded-full text-sm bg-[rgba(201,162,39,0.15)] text-gold border border-[rgba(201,162,39,0.3)]">
          الكل
        </span>
        {categories.map((c) => (
          <span
            key={c}
            className="px-4 py-1.5 rounded-full text-sm text-muted border border-[rgba(201,162,39,0.15)] hover:border-gold/40 cursor-default"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {persons.map((p) => (
          <Link
            key={p.id}
            href={`/characters/${p.slug}`}
            className="glass card-hover rounded-2xl overflow-hidden group"
          >
            <div className="h-48 bg-gradient-to-br from-[#1a1814] via-[#141210] to-[#0f0e0c] flex items-center justify-center border-b border-[rgba(201,162,39,0.12)] relative">
              <span className="text-6xl text-gold/20 font-bold group-hover:text-gold/35 transition-colors">
                {p.name.charAt(0)}
              </span>
              <div className="absolute bottom-3 right-3 flex flex-wrap gap-1 justify-end max-w-[70%]">
                {p.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-0.5 rounded bg-[rgba(0,0,0,0.5)] text-gold/80"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-semibold text-xl mb-1 group-hover:text-gold transition-colors">
                {p.name}
              </h2>
              {p.nameEn && <p className="text-xs text-muted mb-2">{p.nameEn}</p>}
              <p className="text-sm text-gold mb-3">
                {p.birthYear ?? "؟"} — {p.deathYear ?? "؟"} · {p.civilization}
              </p>
              <p className="text-sm text-muted line-clamp-3 leading-relaxed">{p.shortBio}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-muted">
        هذه نسخة تجريبية ببيانات محدودة. يمكن إضافة مئات الشخصيات لاحقًا عبر هيكل البيانات.
      </p>
    </div>
  );
}
