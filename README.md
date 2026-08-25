# أرشيف التاريخ | History Archive

منصة تاريخية تفاعلية (نسخة أولية MVP) تجمع الشخصيات، الخط الزمني، الخرائط، المعارك، الروايات، آلة الزمن، والتاريخ البديل.

## المكدس التقني

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Framer Motion** للحركات
- **Leaflet / react-leaflet** للخريطة
- **Lucide React** للأيقونات
- دعم **RTL** كامل + خط عربي (Noto Naskh Arabic)

## هيكل المشروع

```
src/
  app/                  # الصفحات (App Router)
    page.tsx            # الرئيسية
    characters/         # قائمة + [slug]
    timeline/
    map/
    battles/ + [slug]
    narratives/
    time-machine/
    alternate/
    live-history/
    search/
    ask/
    about/
  components/           # Navbar, Footer, Hero, HistoricalMap...
  data/                 # persons, battles, events, sources
  types/                # TypeScript interfaces
  lib/utils.ts
public/images/
```

## التشغيل المحلي

```bash
cd history-archive
npm install
npm run dev
```

افتح http://localhost:3000

للإنتاج:

```bash
npm run build
npm start
```

## إضافة شخصية جديدة

1. افتح `src/data/persons.ts`
2. أضف كائنًا جديدًا يطابق واجهة `Person` في `src/types/index.ts`
3. أضف المصادر في `src/data/sources.ts` إن لزم
4. الصفحة الديناميكية `/characters/[slug]` تُولَّد تلقائيًا عبر `generateStaticParams`

## إضافة معركة أو حدث

- المعارك: `src/data/battles.ts`
- الأحداث: `src/data/events.ts`
- مقارنات الروايات: `narrativeComparisons` في `events.ts`

## إضافة مصدر

أضف إلى `src/data/sources.ts` ثم اربط الـ `id` في الحقول `sources: string[]` للكيانات.

## النشر

### Vercel (موصى به)

```bash
npm i -g vercel
vercel
```

أو اربط المستودع على vercel.com.

### GitHub Pages

Next.js يحتاج إعدادات خاصة لـ static export:

في `next.config.ts`:

```ts
const nextConfig = {
  output: 'export',
  // ...
};
```

ثم:

```bash
npm run build
# انشر مجلد out/
```

ملاحظة: الخريطة التفاعلية (Leaflet) والصفحات الديناميكية تعمل أفضل على Vercel أو أي استضافة Node.

## ملاحظات مهمة

- البيانات تجريبية ومحدودة عمدًا (صلاح الدين، هولاكو، المستعصم، حطين، سقوط بغداد 1258).
- لا تُختلق معلومات أو مصادر.
- عند عدم اليقين يُشار إلى ذلك بوضوح.
- الخريطة الحالية تعرض علامات للمعارك فقط؛ حدود الدول التاريخية تحتاج بيانات GIS من مصادر أكاديمية.

## لوحة الإدارة (مستقبلية)

الهيكل الحالي مبني على ملفات TypeScript. يمكن لاحقًا ربط CMS أو قاعدة بيانات (مثلاً Supabase / Prisma) مع لوحة إدارة لإضافة/تعديل/حذف دون لمس الكود.

---

© أرشيف التاريخ — نسخة أولية قابلة للتوسع.
