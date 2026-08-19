import { narrativeComparisons } from "@/data/events";
import { getSourcesByIds } from "@/data/sources";
import Link from "next/link";

export default function NarrativesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          من كتب التاريخ؟
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          مقارنة الروايات حول الأحداث التاريخية الخلافية. لا نقدم رأيًا واحدًا كحقيقة مطلقة.
        </p>
      </header>

      {narrativeComparisons.map((n) => {
        const sources = getSourcesByIds(n.sources);
        return (
          <article key={n.id} className="glass rounded-2xl p-6 sm:p-8 mb-10">
            <h2 className="text-2xl font-bold text-gold mb-2">{n.eventTitle}</h2>
            <p className="text-sm text-muted mb-6">{n.year} م</p>

            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-foreground/90">
                ما يتفق عليه المؤرخون (تقريبًا)
              </h3>
              <ul className="space-y-2">
                {n.agreedFacts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-gold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-foreground/90">
                نقاط الاختلاف
              </h3>
              {n.disputedPoints.map((dp, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <p className="font-medium text-amber-400/90 mb-3">{dp.point}</p>
                  <div className="space-y-3 pr-4 border-r border-[rgba(201,162,39,0.25)]">
                    {dp.versions.map((v, j) => (
                      <div key={j} className="bg-[rgba(0,0,0,0.25)] rounded-lg p-4 text-sm">
                        <p className="text-gold text-xs mb-1">{v.sourceLabel}</p>
                        <p className="text-muted">{v.claim}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <p className="text-sm text-muted italic mb-6 border-t border-[rgba(201,162,39,0.15)] pt-4">
              {n.note}
            </p>

            <div>
              <h4 className="text-sm font-semibold text-gold mb-2">المصادر</h4>
              <ul className="text-xs text-muted space-y-1">
                {sources.map((s) => (
                  <li key={s.id}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold"
                      >
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                    {s.author && ` — ${s.author}`}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
