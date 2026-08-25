import { notFound } from "next/navigation";
import Link from "next/link";
import { battles, getBattleBySlug } from "@/data/battles";
import { getSourcesByIds } from "@/data/sources";
import { getPersonById } from "@/data/persons";

export function generateStaticParams() {
  return battles.map((b) => ({ slug: b.slug }));
}

export default async function BattlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const battle = getBattleBySlug(slug);
  if (!battle) notFound();

  const sources = getSourcesByIds(battle.sources);
  const related = (battle.relatedPersons || [])
    .map((id) => getPersonById(id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 animate-parchment">
      <header className="mb-10">
        <p className="text-gold text-sm mb-2">{battle.date}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          {battle.name}
        </h1>
        <p className="text-muted">{battle.location}</p>
      </header>

      <section className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gold mb-3">الأهمية</h2>
        <p className="text-foreground/90 leading-relaxed">{battle.significance}</p>
      </section>

      <section className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gold mb-3">الوصف</h2>
        <p className="text-foreground/90 leading-relaxed">{battle.description}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gold mb-4">الأطراف</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {battle.sides.map((s, i) => (
            <div key={i} className="glass rounded-xl p-5">
              <h3 className="font-semibold mb-2">{s.name}</h3>
              {s.leaders && (
                <p className="text-sm text-muted mb-1">
                  القادة: {s.leaders.join("، ")}
                </p>
              )}
              {s.result && (
                <p className="text-sm text-gold">النتيجة: {s.result}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gold mb-3">النتيجة النهائية</h2>
        <p className="text-foreground/90">{battle.outcome}</p>
      </section>

      {related.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gold mb-4">شخصيات مرتبطة</h2>
          <div className="flex flex-wrap gap-3">
            {related.map(
              (p) =>
                p && (
                  <Link
                    key={p.id}
                    href={`/characters/${p.slug}`}
                    className="px-4 py-2 rounded-full glass text-sm hover:text-gold transition-colors"
                  >
                    {p.name}
                  </Link>
                )
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-gold mb-4">المصادر</h2>
        <ul className="space-y-2">
          {sources.map((s) => (
            <li key={s.id} className="text-sm glass rounded-xl p-4">
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
                <span>{s.title}</span>
              )}
              {s.author && <span className="text-muted"> — {s.author}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
