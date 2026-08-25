import Link from "next/link";
import { Scroll } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(201,162,39,0.2)] bg-[#0c0c0e] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scroll className="h-6 w-6 text-gold" />
              <span className="text-lg font-bold text-gold-gradient">أرشيف التاريخ</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              منصة تاريخية تفاعلية تهدف إلى تقديم التاريخ بوضوح ومصادر، مع التمييز بين الحقائق والروايات والخيال.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4">أقسام رئيسية</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/characters" className="hover:text-gold transition-colors">
                  الشخصيات
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-gold transition-colors">
                  الخط الزمني
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-gold transition-colors">
                  الخريطة التاريخية
                </Link>
              </li>
              <li>
                <Link href="/battles" className="hover:text-gold transition-colors">
                  الحروب والمعارك
                </Link>
              </li>
              <li>
                <Link href="/narratives" className="hover:text-gold transition-colors">
                  الروايات التاريخية
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4">مبادئ الموقع</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>لا اختراع لمعلومات تاريخية</li>
              <li>إظهار المصادر والمراجع</li>
              <li>التمييز بين الحقيقة والتفسير والخيال</li>
              <li>الشفافية عند عدم اليقين</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[rgba(201,162,39,0.12)] text-center text-xs text-muted">
          <p>© {new Date().getFullYear()} أرشيف التاريخ — History Archive. نسخة أولية قابلة للتوسع.</p>
          <p className="mt-1">البيانات التجريبية محدودة وموثقة قدر الإمكان. يُرجى التحقق من المصادر الأصلية.</p>
        </div>
      </div>
    </footer>
  );
}
