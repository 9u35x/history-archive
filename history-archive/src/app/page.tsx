import { Hero } from "@/components/Hero";
import Link from "next/link";
import { persons } from "@/data/persons";
import { battles } from "@/data/battles";
import { Clock, Map, Swords, BookOpen, Sparkles, MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gold-gradient">
          استكشف الأرشيف
        </h2>
        <p className="text-center text-muted mb-12 max-w-2xl mx-auto">
          أقسام تفاعلية مصممة لتقديم التاريخ بوضوح ومصادر.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              href: "/characters",
              icon: UsersIcon,
              title: "الشخصيات",
              desc: "قادة وملوك وعلماء وفلاسفة — بطاقات وصفحات سينمائية.",
            },
            {
              href: "/timeline",
              icon: Clock,
              title: "الخط الزمني",
              desc: "اسحب عبر القرون واستكشف الأحداث والحكام والحروب.",
            },
            {
              href: "/map",
              icon: Map,
              title: "الخريطة التاريخية",
              desc: "خريطة تفاعلية تتغير حسب السنة المختارة.",
            },
            {
              href: "/battles",
              icon: Swords,
              title: "الحروب والمعارك",
              desc: "تفاصيل المعارك والنتائج والأهمية التاريخية.",
            },
            {
              href: "/narratives",
              icon: BookOpen,
              title: "من كتب التاريخ؟",
              desc: "مقارنة الروايات والمصادر حول الأحداث الخلافية.",
            },
            {
              href: "/time-machine",
              icon: Sparkles,
              title: "آلة الزمن",
              desc: "أدخل سنة واكتشف العالم في تلك الفترة.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass card-hover rounded-2xl p-6 group"
            >
              <item.icon className="h-8 w-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[rgba(201,162,39,0.12)]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient">شخصيات مختارة</h2>
          <Link href="/characters" className="text-sm text-gold hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {persons.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              href={`/characters/${p.slug}`}
              className="glass card-hover rounded-2xl overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-[#1a1814] to-[#0f0e0c] flex items-center justify-center border-b border-[rgba(201,162,39,0.15)]">
                <span className="text-4xl text-gold/30 font-bold">{p.name.charAt(0)}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-xs text-gold mb-2">
                  {p.birthYear} — {p.deathYear}
                </p>
                <p className="text-sm text-muted line-clamp-2">{p.shortBio}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[rgba(201,162,39,0.12)]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient">معارك بارزة</h2>
          <Link href="/battles" className="text-sm text-gold hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {battles.map((b) => (
            <Link
              key={b.id}
              href={`/battles/${b.slug}`}
              className="glass card-hover rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{b.name}</h3>
                  <p className="text-xs text-gold mb-3">
                    {b.date} — {b.location}
                  </p>
                  <p className="text-sm text-muted line-clamp-2">{b.significance}</p>
                </div>
                <Swords className="h-6 w-6 text-gold/50 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center glow-gold">
          <MessageCircle className="h-10 w-10 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 text-gold-gradient">اسأل التاريخ</h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            اطرح أسئلة حول الشخصيات والأحداث والسنوات. الإجابات مبنية على البيانات المتوفرة في
            الموقع مع الإشارة إلى حدود المعرفة.
          </p>
          <Link
            href="/ask"
            className="inline-flex px-8 py-3 rounded-full bg-gold text-[#0a0a0b] font-semibold hover:bg-gold-light transition-colors"
          >
            ابدأ المحادثة
          </Link>
        </div>
      </section>
    </>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
