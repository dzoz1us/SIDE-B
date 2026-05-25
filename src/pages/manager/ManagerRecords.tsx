import { useState, useMemo } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, Pagination, FilterBar, SelectInput, ConfirmModal } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";

const PER_PAGE = 10;

export default function ManagerRecords() {
  const { navigate, records, setRecords, ensembles, recordBranches, branches } = useApp();
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const getTotalStock = (recordId: number) =>
    recordBranches.filter(rb => rb.recordId === recordId).reduce((s, rb) => s + rb.quantity, 0);

  const getBranch = (recordId: number) => {
    const rb = recordBranches.find(r => r.recordId === recordId);
    return rb ? branches.find(b => b.id === rb.branchId)?.name ?? "—" : "—";
  };

  const filtered = useMemo(() => {
    return records.filter(r => {
      const ensemble = ensembles.find(e => e.id === r.ensembleId);
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        (ensemble?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        r.label.toLowerCase().includes(search.toLowerCase());
      const totalStock = getTotalStock(r.id);
      const matchStock = stockFilter === "all" || (stockFilter === "instock" && totalStock > 0) || (stockFilter === "empty" && totalStock === 0);
      const matchBranch = branchFilter === "all" || recordBranches.some(rb => rb.recordId === r.id && rb.branchId === Number(branchFilter));
      return matchSearch && matchStock && matchBranch;
    });
  }, [records, ensembles, recordBranches, search, stockFilter, branchFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function deleteRecord() {
    if (deleteId !== null) {
      setRecords(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Управление пластинками"
        action={<Btn variant="primary" onClick={() => navigate("manager-record-form", { mode: "add" })}><Plus size={14} /> Добавить пластинку</Btn>}
      />

      <FilterBar>
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск по названию, ансамблю, лейблу..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
        </div>
        <SelectInput value={stockFilter} onChange={v => { setStockFilter(v); setPage(1); }}
          options={[{ value: "all", label: "Все" }, { value: "instock", label: "В наличии" }, { value: "empty", label: "Нет на складе" }]}
          className="min-w-[160px]" />
        <SelectInput value={branchFilter} onChange={v => { setBranchFilter(v); setPage(1); }}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="min-w-[180px]" />
      </FilterBar>

      <TableWrap>
        <thead>
          <tr>
            <Th className="w-14">Фото</Th>
            <Th>Название</Th>
            <Th>Ансамбль</Th>
            <Th>Кат. №</Th>
            <Th>Лейбл</Th>
            <Th>Опт. цена</Th>
            <Th>Розн. цена</Th>
            <Th>Остаток</Th>
            <Th>Продано</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {paged.map(record => {
            const ensemble = ensembles.find(e => e.id === record.ensembleId);
            const stock = getTotalStock(record.id);
            return (
              <Tr key={record.id}>
                <Td>
                  <div className="w-10 h-10 overflow-hidden bg-secondary">
                    <img src={record.cover} alt={record.title} className="w-full h-full object-cover" />
                  </div>
                </Td>
                <Td>
                  <button onClick={() => navigate("record", { id: record.id })}
                    className="font-medium text-foreground hover:text-primary transition-colors text-xs">
                    {record.title}
                  </button>
                </Td>
                <Td><span className="text-xs text-muted-foreground">{ensemble?.name}</span></Td>
                <Td><span className="font-data text-xs text-muted-foreground">{record.catalogNumber}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{record.label}</span></Td>
                <Td><span className="text-xs">{formatPrice(record.wholesalePrice)}</span></Td>
                <Td><span className="text-primary text-xs font-medium">{formatPrice(record.price)}</span></Td>
                <Td>
                  <span className={`text-xs font-data font-medium ${stock === 0 ? "text-red-400" : stock <= 2 ? "text-yellow-400" : "text-green-400"}`}>
                    {stock}
                  </span>
                </Td>
                <Td><span className="text-xs font-data">{record.soldCurrentYear}</span></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate("manager-record-form", { mode: "edit", recordId: record.id })}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => setDeleteId(record.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
          {paged.length === 0 && (
            <tr><td colSpan={10} className="py-12 text-center text-muted-foreground">Пластинки не найдены</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteRecord}
        title="Удалить пластинку"
        message="Вы уверены? Пластинка будет удалена из каталога безвозвратно."
      />
    </div>
  );
}
