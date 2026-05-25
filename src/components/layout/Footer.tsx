import { Phone, Mail, MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="font-display text-xl font-bold text-primary mb-3 tracking-[0.15em]">SIDE B</div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Магазин виниловых пластинок с редкими изданиями и классическими релизами. Пять филиалов по всей России.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Навигация</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "О магазине", page: "home" },
                { label: "Каталог пластинок", page: "records" },
                { label: "Ансамбли", page: "ensembles" },
                { label: "Филиалы", page: "branches" },
                { label: "Лидеры продаж", page: "bestsellers" },
              ].map(l => (
                <button key={l.page} onClick={() => navigate(l.page)}
                  className="text-left text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Контакты</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone size={13} className="text-primary/60" /> +7 (495) 123-45-67</div>
              <div className="flex items-center gap-2"><Mail size={13} className="text-primary/60" /> info@sideb.ru</div>
              <div className="flex items-center gap-2"><MapPin size={13} className="text-primary/60" /> Москва, ул. Арбат, 15</div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-muted-foreground">© 2025 Side B. Все права защищены.</p>
          <div className="h-px w-8 bg-primary/30" />
        </div>
      </div>
    </footer>
  );
}
