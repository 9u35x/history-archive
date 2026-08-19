"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Users, Compass } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,39,0.08)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMzBoNjBNMzAgMHYzMCIgc3Ryb2tlPSJyZ2JhKDIwMSwxNjIsMzksMC4wNikiIGZpbGw9Im5vbmUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-40" />

      {/* Floating dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold/40 float-dot"
          style={{
            top: `${15 + (i * 7) % 70}%`,
            left: `${10 + (i * 13) % 80}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-gold/80 text-sm tracking-widest mb-6 uppercase">
            History Archive
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-gold-gradient">التاريخ ليس مجرد سنوات...</span>
            <br />
            <span className="text-foreground">إنه قرارات غيّرت العالم.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            استكشف حياة القادة، صعود الإمبراطوريات، سقوط الممالك، المعارك التي غيّرت
            التاريخ، والأحداث التي صنعت عالمنا.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-[#0a0a0b] font-semibold hover:bg-gold-light transition-colors glow-gold"
            >
              <Compass className="h-5 w-5" />
              ابدأ الرحلة
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[rgba(201,162,39,0.5)] text-gold hover:bg-[rgba(201,162,39,0.12)] transition-colors"
            >
              <Map className="h-5 w-5" />
              استكشف الخريطة
            </Link>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[rgba(201,162,39,0.35)] text-foreground/90 hover:border-gold hover:text-gold transition-colors"
            >
              <Users className="h-5 w-5" />
              استكشف الشخصيات
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
