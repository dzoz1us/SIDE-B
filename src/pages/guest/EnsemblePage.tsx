import { useState, useEffect } from "react";
import { ChevronRight, Globe, Calendar, Disc, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getEnsemble } from "../../services/ensembles";
import { Btn, Badge } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { EnsembleDetail } from "../../types";

export default function EnsemblePage() {
  const { params, navigate, role, records } = useApp();
  const [ensemble, setEnsemble] = useState<EnsembleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"about" | "discography" | "members">("about");

  useEffect(() => {
    if (params.id) {
      getEnsemble(params.id)
        .then(setEnsemble)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;
  if (!ensemble) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Ансамбль не найден</div>;

  const ensembleRecords = records.filter(r => r.ensemble_name === ensemble.name);

  const tabs = [
    { key: "about", label: "О коллективе" },
    { key: "discography", label: "Дискография" },
    { key: "members", label: "Состав" },
  ] as const;

  return (
    <div>
      <div className="relative h-72 overflow-hidden">
        <img src={ensemble.image || ""} alt={ensemble.name} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 lg:px-8 pb-8">
          <button onClick={() => navigate("ensembles")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-3">
            Ансамбли <ChevronRight size={12} /> {ensemble.name}
          </button>
          <div className="flex items-end gap-6 flex-wrap">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">{ensemble.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                {ensemble.country && <span className="flex items-center gap-1.5"><Globe size={13} className="text-primary/60" />{ensemble.country}</span>}
                {ensemble.founded && <span className="flex items-center gap-1.5"><Calendar size={13} className="text-primary/60" />с {ensemble.founded} года</span>}
                <span className="flex items-center gap-1.5"><Disc size={13} className="text-primary/60" />{ensembleRecords.length} альбомов</span>
                <span className="flex items-center gap-1.5"><Users size={13} className="text-primary/60" />{ensemble.members.length} участников</span>
              </div>
            </div>
            {ensemble.type && <Badge variant="gold">{ensemble.type}</Badge>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex gap-0 border-b border-border mt-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-3.5 text-sm font-medium transition-colors relative ${
                tab === t.key
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}>{t.label}</button>
          ))}
        </div>

        <div className="py-10">
          {tab === "about" && (
            <div className="max-w-3xl">
              <p className="text-muted-foreground text-base leading-relaxed mb-4">{ensemble.description || "Описание отсутствует"}</p>
            </div>
          )}
          {tab === "discography" && (
            <div>
              {ensembleRecords.length === 0 ? (
                <p className="text-muted-foreground">Пластинки не найдены</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {ensembleRecords.map(record => (
                    <div key={record.id} className="group bg-card border border-border overflow-hidden">
                      <div className="aspect-square overflow-hidden bg-secondary">
                        <img src={record.cover_image || ""} alt={record.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-foreground text-sm leading-snug line-clamp-2">{record.title}</h4>
                        <p className="text-muted-foreground text-xs mt-1">{record.release_date?.slice(0, 4)} · {record.label}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-primary font-medium text-sm">{formatPrice(Number(record.retail_price))}</span>
                          <Btn variant="outline" onClick={() => navigate("record", { id: record.id })} className="text-xs px-3 py-1">Подробнее</Btn>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "members" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              {ensemble.members.length === 0 ? (
                <p className="text-muted-foreground">Состав не указан</p>
              ) : (
                ensemble.members.map(member => (
                  <div key={member.musician_id} className="bg-card border border-border p-4 flex items-center gap-4">
                    <div className="w-14 h-14 overflow-hidden flex-shrink-0 bg-secondary rounded-full">
                      <div className="w-full h-full flex items-center justify-center text-foreground font-bold text-lg">
                        {member.first_name[0]}{member.last_name[0]}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <button onClick={() => navigate("musician", { id: member.musician_id })}
                        className="font-medium text-foreground hover:text-primary transition-colors text-sm block">
                        {member.first_name} {member.last_name}
                      </button>
                      <p className="text-muted-foreground text-xs mt-0.5">{member.role}</p>
                      {member.instrument && <p className="text-muted-foreground text-xs">{member.instrument}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}