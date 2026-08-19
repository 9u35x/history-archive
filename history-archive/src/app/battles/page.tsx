import Link from "next/link";
import { battles } from "@/data/battles";
import { Swords } from "lucide-react";

export default function BattlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">
          الحروب والمعارك
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          بطاقات لمعارك مختارة مع التفاصيل والنتائج والمصادر.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {battles.map((b) => (
          <Link
            key={b.id}
            href={`/battles/${b.slug}`}
            className="glass card-hover rounded-2xl p-6 group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[rgba(201,162,39,0.12)] text-gold group-hover:scale-110 transition-transform">
                <Swords className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1 group-hover:text-gold transition-colors">
                  {b.name}
                </h2>
                <p className="text-sm text-gold mb-2">
                  {b.date} · {b.location}
                </p>
                <p className="text-sm text-muted line-clamp-2 mb-3">{b.significance}</p>
                <div className="flex flex-wrap gap-2">
                  {b.sides.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-[rgba(0,0,0,0.3)] text-muted"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
