import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Btn, PageTitle, SelectInput, Pagination, FilterBar, Badge } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";

const PER_PAGE = 9;

export default function RecordsPage() {
  const { navigate, records, ensembles, recordBranches, branches } = useApp();
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [page, setPage] = useState(1);

  const labels = ["all", ...Array.from(new Set(records.map(r => r.label)))];
  const genres = ["all", ...Array.from(new Set(records.map(r => r.genre)))];

  const getTotalStock = (recordId: number) =>
    recordBranches.filter(rb => rb.recordId === recordId).reduce((s, rb) => s + rb.quantity, 0);

  const filtered = useMemo(() => {
    let result = records.filter(r => {
      const ensemble = ensembles.find(e => e.id === r.ensembleId);
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        (ensemble?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchLabel = labelFilter === "all" || r.label === labelFilter;
      const matchGenre = genreFilter === "all" || r.genre === genreFilter;
      const totalStock = getTotalStock(r.id);
      const matchStock = stockFilter === "all" || (stockFilter === "instock" && totalStock > 0);
      const matchBranch = branchFilter === "all" ||
        recordBranches.some(rb => rb.recordId === r.id && rb.branchId === Number(branchFilter) && rb.quantity > 0);
      return matchSearch && matchLabel && matchGenre && matchStock && matchBranch;
    });
    if (sort === "price-asc") result = result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = result.sort((a, b) => b.price - a.price);
    if (sort === "year") result = result.sort((a, b) => b.year - a.year);
    if (sort === "popularity") result = result.sort((a, b) => b.soldCurrentYear - a.soldCurrentYear);
    return result;
  }, [records, ensembles, recordBranches, search, labelFilter, genreFilter, stockFilter, branchFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Каталог пластинок" subtitle={`${filtered.length} наименований`} />

      <FilterBar>
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск по названию или ансамблю..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
        </div>
        <SelectInput value={labelFilter} onChange={v => { setLabelFilter(v); setPage(1); }}
          options={labels.map(l => ({ value: l, label: l === "all" ? "Все лейблы" : l }))} className="min-w-[160px]" />
        <SelectInput value={genreFilter} onChange={v => { setGenreFilter(v); setPage(1); }}
          options={genres.map(g => ({ value: g, label: g === "all" ? "Все жанры" : g }))} className="min-w-[140px]" />
        <SelectInput value={stockFilter} onChange={v => { setStockFilter(v); setPage(1); }}
          options={[{ value: "all", label: "Все" }, { value: "instock", label: "В наличии" }]} className="min-w-[140px]" />
        <SelectInput value={branchFilter} onChange={v => { setBranchFilter(v); setPage(1); }}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="min-w-[180px]" />
        <SelectInput value={sort} onChange={setSort}
          options={[
            { value: "popularity", label: "По популярности" },
            { value: "price-asc", label: "Цена: по возрастанию" },
            { value: "price-desc", label: "Цена: по убыванию" },
            { value: "year", label: "По году выпуска" },
          ]} className="min-w-[200px]" />
      </FilterBar>

      {paged.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">Пластинки не найдены</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paged.map(record => {
            const ensemble = ensembles.find(e => e.id === record.ensembleId);
            const totalStock = getTotalStock(record.id);
            return (
              <div key={record.id} className="group bg-card border border-border overflow-hidden flex flex-col">
                <div className="aspect-square overflow-hidden bg-secondary relative">
                  <img src={record.cover} alt={record.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-2 right-2">
                    {totalStock > 0
                      ? <Badge variant="success">В наличии</Badge>
                      : <Badge variant="danger">Нет в наличии</Badge>
                    }
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h4 className="font-medium text-foreground text-xs leading-snug line-clamp-2 mb-1">
                    {record.title}
                  </h4>
                  <p className="text-muted-foreground text-xs mb-0.5">{ensemble?.name}</p>
                  <p className="text-muted-foreground text-xs mb-3">{record.year} · {record.genre}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-primary font-medium text-sm">{formatPrice(record.price)}</span>
                  </div>
                  <Btn variant="outline" onClick={() => navigate("record", { id: record.id })}
                    className="w-full mt-2 justify-center text-xs py-1.5">
                    Подробнее
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
