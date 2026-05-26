import { useState, useMemo } from "react";
import { Search, Disc, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, SelectInput, Pagination, FilterBar } from "../../components/ui";

const PER_PAGE = 6;

export default function EnsemblesPage() {
  const { navigate, ensembles } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const types = ["all", ...Array.from(new Set(ensembles.map(e => e.type).filter(Boolean)))];
  const countries = ["all", ...Array.from(new Set(ensembles.map(e => e.country).filter(Boolean)))];

  const filtered = useMemo(() => {
    let result = ensembles.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || e.type === typeFilter;
      const matchCountry = countryFilter === "all" || e.country === countryFilter;
      return matchSearch && matchType && matchCountry;
    });
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    if (sort === "founded") result = [...result].sort((a, b) => (a.founded || 0) - (b.founded || 0));
    return result;
  }, [ensembles, search, typeFilter, countryFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Каталог ансамблей" subtitle={`${filtered.length} коллективов`} />
      <FilterBar>
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск по названию..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
        </div>
        <SelectInput value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }}
          options={types.map(t => ({ value: t, label: t === "all" ? "Все типы" : t }))} className="min-w-[160px]" />
        <SelectInput value={countryFilter} onChange={v => { setCountryFilter(v); setPage(1); }}
          options={countries.map(c => ({ value: c, label: c === "all" ? "Все страны" : c }))} className="min-w-[160px]" />
        <SelectInput value={sort} onChange={setSort}
          options={[
            { value: "name", label: "По названию" },
            { value: "founded", label: "По году основания" },
          ]} className="min-w-[200px]" />
      </FilterBar>

      {paged.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">Ансамбли не найдены</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paged.map(ensemble => (
            <button key={ensemble.id} onClick={() => navigate("ensemble", { id: ensemble.id })}
              className="group text-left bg-card border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden">
              <div className="aspect-video overflow-hidden bg-secondary">
                <img src={ensemble.image || ""} alt={ensemble.name}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {ensemble.name}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 flex-shrink-0">{ensemble.founded}</span>
                </div>
                <p className="text-muted-foreground text-xs mb-3">{ensemble.type} · {ensemble.country}</p>
                <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{ensemble.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3">
                  <span className="flex items-center gap-1.5"><Disc size={12} className="text-primary/60" /> Альбомы</span>
                  <span className="flex items-center gap-1.5"><Users size={12} className="text-primary/60" /> Участники</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}