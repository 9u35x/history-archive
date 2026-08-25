"use client";

import { useState } from "react";
import { persons } from "@/data/persons";
import { battles } from "@/data/battles";
import { events } from "@/data/events";
import Link from "next/link";
import { Send } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string; links?: { href: string; label: string }[] };

function answer(query: string): Message {
  const q = query.trim().toLowerCase();

  // Simple keyword matching against local data
  const person = persons.find(
    (p) =>
      p.name.includes(query.trim()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      p.slug.includes(q)
  );
  if (person) {
    return {
      role: "assistant",
      text: `${person.name}: ${person.shortBio}\n\nالفترة: ${person.birthYear} — ${person.deathYear}. الدور: ${person.role}.\n\nهذه المعلومات مستمدة من بيانات الموقع. راجع صفحة الشخصية والمصادر للتفاصيل.`,
      links: [{ href: `/characters/${person.slug}`, label: `صفحة ${person.name}` }],
    };
  }

  if (q.includes("1258") || q.includes("سقوط بغداد") || q.includes("بغداد")) {
    const e = events.find((x) => x.id === "fall-baghdad-1258");
    return {
      role: "assistant",
      text: e
        ? `${e.title} (${e.year}): ${e.description}\n\nهناك اختلافات بين المصادر حول حجم الدمار وعدد القتلى. راجع قسم «من كتب التاريخ؟» للمقارنة.`
        : "سقوط بغداد 1258 حدث مفصلي. راجع قسم الروايات والمعارك.",
      links: [
        { href: "/narratives", label: "الروايات التاريخية" },
        { href: "/battles/baghdad-1258", label: "سقوط بغداد" },
      ],
    };
  }

  if (q.includes("حطين") || q.includes("صلاح") || q.includes("قدس")) {
    return {
      role: "assistant",
      text: "معركة حطين (1187) واستعادة القدس مرتبطتان بصلاح الدين الأيوبي. راجع صفحات الشخصية والمعركة.",
      links: [
        { href: "/characters/saladin", label: "صلاح الدين" },
        { href: "/battles/hattin", label: "معركة حطين" },
      ],
    };
  }

  if (q.includes("حرب عالمية") || q.includes("عالمية أولى")) {
    return {
      role: "assistant",
      text: "لا تتوفر في البيانات التجريبية الحالية تفاصيل كافية عن الحرب العالمية الأولى. لا أخترع معلومات. يُرجى الرجوع إلى مصادر أكاديمية موثوقة.",
    };
  }

  return {
    role: "assistant",
    text: "لا توجد معلومات كافية في بيانات الموقع الحالية للإجابة بدقة. لا أخترع مصادر أو أحداثًا. جرّب البحث عن: صلاح الدين، حطين، سقوط بغداد 1258، أو استخدم صفحات الشخصيات والخط الزمني.",
    links: [
      { href: "/search", label: "البحث" },
      { href: "/characters", label: "الشخصيات" },
    ],
  };
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "مرحبًا. اسأل عن الشخصيات أو الأحداث المتوفرة في الأرشيف (مثل صلاح الدين، 1258، حطين). الإجابات مبنية على البيانات المحلية فقط.",
    },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input.trim() };
    const reply = answer(input);
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gold-gradient mb-2 text-center">اسأل التاريخ</h1>
      <p className="text-center text-sm text-muted mb-8">
        إجابات محدودة ببيانات الموقع — لا اختلاق.
      </p>

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.25)] mr-8"
                : "glass ml-4"
            }`}
          >
            <p className="whitespace-pre-wrap">{m.text}</p>
            {m.links && (
              <div className="flex flex-wrap gap-2 mt-3">
                {m.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-xs px-3 py-1 rounded-full border border-gold/40 text-gold hover:bg-gold/10"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="مثال: من هو صلاح الدين؟ أو ماذا حدث سنة 1258؟"
          className="flex-1 px-4 py-3 rounded-xl bg-[#141416] border border-[rgba(201,162,39,0.3)] focus:border-gold outline-none"
        />
        <button
          type="button"
          onClick={send}
          className="px-5 py-3 rounded-xl bg-gold text-[#0a0a0b] hover:bg-gold-light transition-colors"
          aria-label="إرسال"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
