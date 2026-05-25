import { ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Btn, SectionTitle } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";

export default function HomePage() {
  const { navigate, ensembles, records } = useApp();
  const topRecords = [...records].sort((a, b) => b.soldCurrentYear - a.soldCurrentYear).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="relative min-h-[78vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=900&fit=crop&auto=format"
            alt="Concert hall"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Decorative gold lines */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24">
          <div className="max-w-xl">
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-5">
              Магазин виниловых пластинок
            </p>
            <h1 className="font-display text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6">
              Музыка,<br />
              <span className="text-primary">которая</span><br />
              остаётся
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Редкие издания, классические записи и современные релизы —
              всё в одном месте. Пять филиалов по всей России.
            </p>
            <div className="flex gap-3">
              <Btn variant="primary" onClick={() => navigate("records")} className="px-7 py-3 text-base">
                Смотреть каталог <ChevronRight size={16} />
              </Btn>
              <Btn variant="ghost" onClick={() => navigate("ensembles")} className="px-7 py-3 text-base">
                Ансамбли
              </Btn>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Popular Ensembles */}
        <section className="py-20">
          <SectionTitle
            title="Популярные ансамбли"
            subtitle="Коллективы, чьи записи пользуются наибольшим спросом в нашем магазине"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ensembles.map(ensemble => (
              <button
                key={ensemble.id}
                onClick={() => navigate("ensemble", { id: ensemble.id })}
                className="group text-left bg-card border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video overflow-hidden bg-secondary">
                  <img
                    src={ensemble.photo}
                    alt={ensemble.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {ensemble.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1.5 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 bg-primary/50 rounded-full" />
                    {ensemble.type} · {ensemble.country}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <Btn variant="outline" onClick={() => navigate("ensembles")}>
              Все ансамбли <ChevronRight size={14} />
            </Btn>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-20 border-t border-border">
          <SectionTitle
            title="Лидеры продаж"
            subtitle="Самые популярные пластинки текущего года"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topRecords.map((record, idx) => {
              const ensemble = ensembles.find(e => e.id === record.ensembleId);
              return (
                <button
                  key={record.id}
                  onClick={() => navigate("record", { id: record.id })}
                  className="group text-left bg-card border border-border hover:border-primary/40 transition-all duration-300 p-5 flex gap-4 items-start"
                >
                  <div className="font-display text-4xl font-bold text-primary/20 w-9 flex-shrink-0 leading-none pt-1">
                    {idx + 1}
                  </div>
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-secondary">
                    <img src={record.cover} alt={record.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm leading-snug line-clamp-2">
                      {record.title}
                    </h4>
                    <p className="text-muted-foreground text-xs mt-1">{ensemble?.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-primary text-sm font-medium">{formatPrice(record.price)}</p>
                      <p className="text-muted-foreground text-xs">{record.soldCurrentYear} копий</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-6">
            <Btn variant="outline" onClick={() => navigate("bestsellers")}>
              Топ-10 лидеров продаж <ChevronRight size={14} />
            </Btn>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 border-t border-border">
          <div className="bg-card border border-border p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <p className="text-primary text-xs tracking-[0.3em] uppercase mb-3">Бронирование</p>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                Забронируйте пластинку онлайн
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                Зарегистрируйтесь и бронируйте понравившиеся пластинки в любом из наших филиалов.
                Бронь действует 48 часов.
              </p>
              <Btn variant="primary" onClick={() => navigate("register")}>
                Создать аккаунт <ChevronRight size={14} />
              </Btn>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
