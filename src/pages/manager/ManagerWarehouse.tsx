import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getRecords } from "../../services/records";
import { getBranches } from "../../services/branches";
import { PageTitle, TableWrap, Th, Td, Tr, SelectInput, Modal, FormInput, Btn } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { RecordShort, Branch } from "../../types";
import api from "../../services/api";

export default function ManagerWarehouse() {
  const [records, setRecords] = useState<RecordShort[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refillModal, setRefillModal] = useState<{ recordId: number; name: string } | null>(null);
  const [refillQty, setRefillQty] = useState("1");

  useEffect(() => {
    Promise.all([getRecords(), getBranches()]).then(([r, b]) => {
      setRecords(r);
      setBranches(b);
      setLoading(false);
    });
  }, []);

  const filtered = branchFilter === "all" ? records : records.filter(r => r.branch_name === branches.find(b => b.id === Number(branchFilter))?.name);

  async function handleRefill() {
    if (!refillModal) return;
    await api.post(`/records/${refillModal.recordId}/restock/`, { quantity: Number(refillQty) });
    setRecords(prev => prev.map(r => r.id === refillModal.recordId ? { ...r, stock_quantity: r.stock_quantity + Number(refillQty) } : r));
    setRefillModal(null);
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Склад" subtitle="Остатки по филиалам" />
      <div className="mb-6">
        <SelectInput value={branchFilter} onChange={setBranchFilter}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]} className="w-[240px]" />
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>Пластинка</Th>
            <Th>Филиал</Th>
            <Th>Остаток</Th>
            <Th>Розн. цена</Th>
            <Th>Действие</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(record => (
            <Tr key={record.id}>
              <Td><span className="text-xs font-medium">{record.title}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{record.branch_name}</span></Td>
              <Td><span className={`text-xs font-medium ${record.stock_quantity === 0 ? "text-red-400" : "text-green-400"}`}>{record.stock_quantity}</span></Td>
              <Td><span className="text-primary text-xs font-medium">{formatPrice(Number(record.retail_price))}</span></Td>
              <Td>
                <Btn variant="ghost" onClick={() => setRefillModal({ recordId: record.id, name: record.title })} className="text-xs py-1 px-2">
                  <Plus size={12} /> Пополнить
                </Btn>
              </Td>
            </Tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Нет данных</td></tr>}
        </tbody>
      </TableWrap>
      <Modal open={!!refillModal} onClose={() => setRefillModal(null)} title="Пополнить склад" size="sm">
        <p className="text-sm text-muted-foreground mb-4">{refillModal?.name}</p>
        <FormInput label="Количество для добавления" type="number" value={refillQty} onChange={setRefillQty} className="mb-5" />
        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={() => setRefillModal(null)}>Отмена</Btn>
          <Btn variant="primary" onClick={handleRefill}>Добавить</Btn>
        </div>
      </Modal>
    </div>
  );
}