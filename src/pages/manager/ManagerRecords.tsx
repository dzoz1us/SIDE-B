import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, ListMusic } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getRecords } from "../../services/records";
import api from "../../services/api";
import { getBranches } from "../../services/branches";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, Pagination, FilterBar, SelectInput, ConfirmModal } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { RecordShort, Branch } from "../../types";

const PER_PAGE = 10;

export default function ManagerRecords() {
  const { navigate } = useApp();
  const [records, setRecords] = useState<RecordShort[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRecords(), getBranches()]).then(([r, b]) => {
      setRecords(r);
      setBranches(b);
      setLoading(false);
    });
  }, []);

  const filtered = records.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.ensemble_name.toLowerCase().includes(search.toLowerCase());
    const matchBranch = branchFilter === "all" || r.branch_name === branches.find(b => b.id === Number(branchFilter))?.name;
    return matchSearch && matchBranch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function deleteRecord() {
    if (deleteId !== null) {
      await api.delete(`/records/${deleteId}/`);
      setRecords(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Управление пластинками"
        action={<Btn variant="primary" onClick={() => navigate("manager-record-form", { mode: "add" })}><Plus size={14} /> Добавить</Btn>} />
      <FilterBar>
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
        </div>
        <SelectInput value={branchFilter} onChange={v => { setBranchFilter(v); setPage(1); }}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]} className="min-w-[180px]" />
      </FilterBar>
      <TableWrap>
        <thead>
          <tr>
            <Th className="w-14">Фото</Th>
            <Th>Название</Th>
            <Th>Ансамбль</Th>
            <Th>Кат. №</Th>
            <Th>Лейбл</Th>
            <Th>Розн. цена</Th>
            <Th>Остаток</Th>
            <Th>Продано</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {paged.map(record => (
            <Tr key={record.id}>
              <Td><div className="w-10 h-10 overflow-hidden bg-secondary"><img src={record.cover_image || ""} alt={record.title} className="w-full h-full object-cover" /></div></Td>
              <Td><button onClick={() => navigate("record", { id: record.id })} className="font-medium text-foreground hover:text-primary transition-colors text-xs">{record.title}</button></Td>
              <Td><span className="text-xs text-muted-foreground">{record.ensemble_name}</span></Td>
              <Td><span className="font-data text-xs text-muted-foreground">{record.catalogue_number}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{record.label}</span></Td>
              <Td><span className="text-primary text-xs font-medium">{formatPrice(Number(record.retail_price))}</span></Td>
              <Td><span className={`text-xs font-medium ${record.stock_quantity === 0 ? "text-red-400" : "text-green-400"}`}>{record.stock_quantity}</span></Td>
              <Td><span className="text-xs font-data">{record.sold_current_year}</span></Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate("admin-tracklist", { recordId: record.id })}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Треклист">
                    <ListMusic size={14} />
                  </button>
                  <button onClick={() => navigate("manager-record-form", { mode: "edit", recordId: record.id })}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
                  <button onClick={() => setDeleteId(record.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </Td>
            </Tr>
          ))}
          {paged.length === 0 && <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">Пластинки не найдены</td></tr>}
        </tbody>
      </TableWrap>
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      <ConfirmModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={deleteRecord} title="Удалить пластинку" message="Вы уверены? Пластинка будет удалена безвозвратно." />
    </div>
  );
}