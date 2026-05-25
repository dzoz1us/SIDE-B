import { useApp } from "../../context/AppContext";
import { PageTitle, Badge } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";

export default function BestsellersPage() {
  const { navigate, records, ensembles } = useApp();
  const top10 = [...records].sort((a, b) => b.soldCurrentYear - a.soldCurrentYear).slice(0, 10);

  const podiumColors = ["text-yellow-400", "text-slate-300", "text-amber-600"];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Лидеры продаж" subtitle="Самые продаваемые пластинки текущего года" />

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {top10.slice(0, 3).map((record, idx) => {
          const ensemble = ensembles.find(e => e.id === record.ensembleId);
          return (
            <button key={record.id} onClick={() => navigate("record", { id: record.id })}
              className={`group text-left bg-card border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                idx === 0 ? "border-yellow-600/40 md:order-2" : idx === 1 ? "border-slate-600/30" : "border-amber-800/30"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img src={record.cover} alt={record.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" />
                <div className={`absolute top-3 left-3 font-display text-5xl font-bold leading-none ${podiumColors[idx]} drop-shadow-lg`}>
                  {idx + 1}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {record.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 mb-3">{ensemble?.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{formatPrice(record.price)}</span>
                  <Badge variant="gold">{record.soldCurrentYear} копий</Badge>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Positions 4-10 */}
      <div className="flex flex-col gap-0 border border-border overflow-hidden">
        {top10.slice(3).map((record, idx) => {
          const ensemble = ensembles.find(e => e.id === record.ensembleId);
          return (
            <button key={record.id} onClick={() => navigate("record", { id: record.id })}
              className="group flex items-center gap-5 p-4 border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors text-left">
              <div className="font-display text-2xl font-bold text-muted-foreground/40 w-8 text-center flex-shrink-0">
                {idx + 4}
              </div>
              <div className="w-14 h-14 overflow-hidden flex-shrink-0 bg-secondary">
                <img src={record.cover} alt={record.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                  {record.title}
                </h4>
                <p className="text-muted-foreground text-xs mt-0.5">{ensemble?.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-primary font-medium text-sm">{formatPrice(record.price)}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{record.soldCurrentYear} копий</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
