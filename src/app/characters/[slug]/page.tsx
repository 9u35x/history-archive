import { notFound } from "next/navigation";
import Link from "next/link";
import { getPersonBySlug, persons } from "@/data/persons";
import { getSourcesByIds } from "@/data/sources";
import { getBattleById } from "@/data/battles";
import { formatYear } from "@/lib/utils";

export function generateStaticParams() {
  return persons.map((p) => ({ slug: p.slug }));
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) notFound();

  const sources = getSourcesByIds(person.sources);
  const relatedBattles = (person.battles || [])
    .map((id) => getBattleById(id))
    .filter(Boolean);

  return (
    <div className="animate-parchment">
      {/* Hero header */}
      <section className="relative border-b border-[rgba(201,162,39,0.2)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(201,162,39,0.06)] to-transparent" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-48 h-64 rounded-2xl bg-gradient-to-br from-[#1a1814] to-[#0c0b0a] border border-[rgba(201,162,39,0.25)] flex items-center justify-center shrink-0 glow-gold">
              <span className="text-7xl text-gold/30 font-bold">{person.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-gold text-sm mb-2">{person.role}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">
                {person.name}
              </h1>
              {person.nameEn && (
                <p className="text-muted text-sm mb-4">{person.nameEn}</p>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted mb-6">
                <span>
                  <strong className="text-foreground/80">الميلاد:</strong>{" "}
                  {formatYear(person.birthYear)} — {person.birthPlace || "غير محدد"}
                </span>
                <span>
                  <strong className="text-foreground/80">الوفاة:</strong>{" "}
                  {formatYear(person.deathYear)} — {person.deathPlace || "غير محدد"}
                </span>
                <span>
                  <strong className="text-foreground/80">الحضارة:</strong>{" "}
                  {person.civilization || "—"}
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed max-w-2xl">{person.shortBio}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {person.categories.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-3 py-1 rounded-full border border-[rgba(201,162,39,0.3)] text-gold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-bold text-gold mb-8">خط حياة الشخصية</h2>
          <div className="relative pr-8 border-r-2 border-[rgba(201,162,39,0.3)] space-y-8">
            {person.timeline.map((ev, i) => (
              <div key={i} className="relative">
                <div className="absolute -right-[41px] top-1 w-5 h-5 rounded-full bg-gold border-4 border-background" />
                <div className="glass rounded-xl p-5">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-gold font-semibold">{formatYear(ev.year)}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[rgba(201,162,39,0.15)] text-gold/90">
                      {ev.type === "birth"
                        ? "ولادة"
                        : ev.type === "death"
                          ? "وفاة"
                          : ev.type === "battle"
                            ? "معركة"
                            : ev.type === "achievement"
                              ? "إنجاز"
                              : "حدث"}
                    </span>
                    {ev.uncertain && (
                      <span className="text-xs text-amber-500/90">غير مؤكد تاريخيًا</span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{ev.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        {person.achievements.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">أهم الإنجازات</h2>
            <ul className="space-y-3">
              {person.achievements.map((a, i) => (
                <li key={i} className="flex gap-3 glass rounded-xl p-4">
                  <span className="text-gold font-bold">{i + 1}</span>
                  <span className="text-foreground/90">{a}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Battles */}
        {relatedBattles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">معارك مرتبطة</h2>
            <div className="grid gap-4">
              {relatedBattles.map(
                (b) =>
                  b && (
                    <Link
                      key={b.id}
                      href={`/battles/${b.slug}`}
                      className="glass card-hover rounded-xl p-5 block"
                    >
                      <h3 className="font-semibold text-lg mb-1">{b.name}</h3>
                      <p className="text-sm text-gold mb-2">{b.date}</p>
                      <p className="text-sm text-muted line-clamp-2">{b.significance}</p>
                    </Link>
                  )
              )}
            </div>
          </section>
        )}

        {/* Last 24 hours */}
        {person.last24Hours && person.last24Hours.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gold mb-4">آخر 24 ساعة</h2>
            <p className="text-sm text-muted mb-6">
              التفاصيل الدقيقة لساعات الحياة الأخيرة غالبًا غير متوفرة أو محل خلاف بين المصادر.
            </p>
            <div className="space-y-3">
              {person.last24Hours.map((h, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gold text-sm font-mono">{h.time}</span>
                    {h.uncertain && (
                      <span className="text-xs text-amber-500">غير مؤكد تاريخيًا</span>
                    )}
                  </div>
                  <p className="text-sm">{h.event}</p>
                  {h.note && <p className="text-xs text-muted mt-1">{h.note}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quotes */}
        {person.famousQuotes && person.famousQuotes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">أقوال منسوبة</h2>
            {person.famousQuotes.map((q, i) => (
              <blockquote
                key={i}
                className="glass rounded-xl p-6 border-r-4 border-gold/50 mb-4"
              >
                <p className="text-foreground/90 italic leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                {q.uncertain && (
                  <p className="text-xs text-amber-500 mt-3">
                    غير مؤكد — تختلف المصادر حول الصيغة أو النسبة
                  </p>
                )}
                {q.source && <p className="text-xs text-muted mt-1">مرجع: {q.source}</p>}
              </blockquote>
            ))}
          </section>
        )}

        {/* Sources */}
        <section>
          <h2 className="text-2xl font-bold text-gold mb-6">المصادر والمراجع</h2>
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.id} className="glass rounded-xl p-4 text-sm">
                <div className="font-medium text-foreground/90">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      {s.title}
                    </a>
                  ) : (
                    s.title
                  )}
                </div>
                <div className="text-muted mt-1">
                  {s.author && <span>{s.author}</span>}
                  {s.year && <span> · {s.year}</span>}
                  <span className="mx-2">·</span>
                  <span className="text-xs uppercase tracking-wide">{s.type}</span>
                </div>
                {s.note && <p className="text-xs text-muted mt-1">{s.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
