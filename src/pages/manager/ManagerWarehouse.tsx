import { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, TableWrap, Th, Td, Tr, SelectInput, Modal, FormInput, Btn, StockDot } from "../../components/ui";
import { formatPrice, nextId } from "../../utils/helpers";

export default function ManagerWarehouse() {
  const { records, ensembles, branches, recordBranches, setRecordBranches } = useApp();
  const [branchFilter, setBranchFilter] = useState("all");
  const [refillModal, setRefillModal] = useState<{ recordId: number; branchId: number; name: string } | null>(null);
  const [refillQty, setRefillQty] = useState("1");

  const rows = recordBranches.filter(rb => branchFilter === "all" || rb.branchId === Number(branchFilter));

  function handleRefill() {
    if (!refillModal) return;
    const qty = parseInt(refillQty) || 0;
    setRecordBranches(prev => prev.map(rb =>
      rb.recordId === refillModal.recordId && rb.branchId === refillModal.branchId
        ? { ...rb, quantity: rb.quantity + qty }
        : rb
    ));
    setRefillModal(null);
    setRefillQty("1");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Склад" subtitle="Остатки по филиалам" />

      <div className="mb-6">
        <SelectInput value={branchFilter} onChange={setBranchFilter}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="w-[240px]" />
      </div>

      <TableWrap>
        <thead>
          <tr>
            <Th>Пластинка</Th>
            <Th>Ансамбль</Th>
            <Th>Филиал</Th>
            <Th>Остаток</Th>
            <Th>Опт. цена</Th>
            <Th>Розн. цена</Th>
            <Th>Действие</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(rb => {
            const record = records.find(r => r.id === rb.recordId);
            const ensemble = record ? ensembles.find(e => e.id === record.ensembleId) : null;
            const branch = branches.find(b => b.id === rb.branchId);
            if (!record) return null;
            return (
              <Tr key={rb.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 overflow-hidden flex-shrink-0 bg-secondary">
                      <img src={record.cover} alt={record.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium">{record.title}</span>
                  </div>
                </Td>
                <Td><span className="text-xs text-muted-foreground">{ensemble?.name}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{branch?.name}</span></Td>
                <Td>
                  <div className="flex items-center">
                    <StockDot qty={rb.quantity} />
                    <span className={`font-data text-xs font-medium ${rb.quantity === 0 ? "text-red-400" : rb.quantity <= 2 ? "text-yellow-400" : "text-green-400"}`}>
                      {rb.quantity}
                    </span>
                  </div>
                </Td>
                <Td><span className="text-xs">{formatPrice(record.wholesalePrice)}</span></Td>
                <Td><span className="text-primary text-xs font-medium">{formatPrice(record.price)}</span></Td>
                <Td>
                  <Btn variant="ghost" onClick={() => { setRefillModal({ recordId: rb.recordId, branchId: rb.branchId, name: record.title }); setRefillQty("1"); }}
                    className="text-xs py-1 px-2">
                    <Plus size={12} /> Пополнить
                  </Btn>
                </Td>
              </Tr>
            );
          })}
          {rows.length === 0 && (
            <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Нет данных</td></tr>
          )}
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
