import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle } from "../../components/ui";

export default function BranchesPage() {
  const { branches } = useApp();
  const mapUrls: Record<number, string> = {
    1: "https://yandex.ru/maps/?text=Москва+Арбат+15",
    2: "https://yandex.ru/maps/?text=Москва+Тверская+5",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Филиалы" subtitle="Магазины по всей России" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {branches.map((branch, idx) => (
          <div key={branch.id} className="bg-card border border-border p-6 relative overflow-hidden group hover:border-primary/40 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-hover:bg-primary/60 transition-colors" />
            <div className="pl-3">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">{branch.name}</h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 flex-shrink-0">#{idx + 1}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin size={14} className="text-primary/60 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={14} className="text-primary/60 flex-shrink-0" />
                  <a href={`tel:${branch.phone.replace(/\D/g, "")}`} className="text-foreground hover:text-primary transition-colors">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2.5 text-sm">
                  <Clock size={14} className="text-primary/60 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{branch.opening_hours}</span>
                </div>
              </div>
              {mapUrls[branch.id] && (
                <a href={mapUrls[branch.id]} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs text-primary hover:text-primary/80 transition-colors">
                  <ExternalLink size={12} /> Показать на карте
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}