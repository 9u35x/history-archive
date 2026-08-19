"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { persons } from "@/data/persons";
import { battles } from "@/data/battles";
import { events } from "@/data/events";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { persons: [], battles: [], events: [] };

    return {
      persons: persons.filter(
        (p) =>
          p.name.includes(term) ||
          p.name.toLowerCase().includes(term) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(term)) ||
          p.shortBio.includes(term) ||
          p.role.includes(term)
      ),
      battles: battles.filter(
        (b) =>
          b.name.includes(term) ||
          b.location.includes(term) ||
          b.significance.includes(term)
      ),
      events: events.filter(
        (e) => e.title.includes(term) || e.description.includes(term)
      ),
    };
  }, [q]);

  const total =
    results.persons.length + results.battles.length + results.events.length;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gold-gradient mb-8 text-center">بحث</h1>

      <div className="relative mb-10">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن شخصية، معركة، حدث..."
          className="w-full pr-12 pl-5 py-4 rounded-2xl bg-[#141416] border border-[rgba(201,162,39,0.3)] text-lg focus:border-gold outline-none"
          autoFocus
        />
      </div>

      {q.trim() && (
        <p className="text-sm text-muted mb-6">
          {total === 0 ? "لا نتائج" : `${total} نتيجة`}
        </p>
      )}

      {results.persons.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gold mb-3">شخصيات</h2>
          <div className="space-y-2">
            {results.persons.map((p) => (
              <Link
                key={p.id}
                href={`/characters/${p.slug}`}
                className="block glass rounded-xl p-4 hover:border-gold/40 transition-colors"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-muted text-sm mr-2"> — {p.role}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.battles.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gold mb-3">معارك</h2>
          <div className="space-y-2">
            {results.battles.map((b) => (
              <Link
                key={b.id}
                href={`/battles/${b.slug}`}
                className="block glass rounded-xl p-4 hover:border-gold/40 transition-colors"
              >
                <span className="font-medium">{b.name}</span>
                <span className="text-muted text-sm mr-2"> — {b.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.events.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gold mb-3">أحداث</h2>
          <div className="space-y-2">
            {results.events.map((e) => (
              <div key={e.id} className="glass rounded-xl p-4">
                <span className="font-medium">{e.title}</span>
                <span className="text-muted text-sm mr-2"> — {e.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
