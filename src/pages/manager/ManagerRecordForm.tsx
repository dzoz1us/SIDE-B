import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, FormInput, SelectInput } from "../../components/ui";
import { nextId } from "../../utils/helpers";

export default function ManagerRecordForm() {
  const { params, navigate, records, setRecords, ensembles, branches } = useApp();
  const isEdit = params.mode === "edit";
  const existing = isEdit ? records.find(r => r.id === params.recordId) : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [ensembleId, setEnsembleId] = useState(String(existing?.ensembleId ?? ensembles[0]?.id ?? ""));
  const [catalogNumber, setCatalogNumber] = useState(existing?.catalogNumber ?? "");
  const [label, setLabel] = useState(existing?.label ?? "");
  const [supplier, setSupplier] = useState(existing?.supplier ?? "");
  const [year, setYear] = useState(String(existing?.year ?? new Date().getFullYear()));
  const [wholesalePrice, setWholesalePrice] = useState(String(existing?.wholesalePrice ?? ""));
  const [price, setPrice] = useState(String(existing?.price ?? ""));
  const [genre, setGenre] = useState(existing?.genre ?? "");
  const [cover, setCover] = useState(existing?.cover ?? "");
  const [branchId, setBranchId] = useState(String(branches[0]?.id ?? ""));
  const [quantity, setQuantity] = useState("0");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const recordData = {
      title, ensembleId: Number(ensembleId), catalogNumber, label,
      supplier, year: Number(year), wholesalePrice: Number(wholesalePrice),
      price: Number(price), genre, cover,
      soldCurrentYear: existing?.soldCurrentYear ?? 0,
    };
    if (isEdit && existing) {
      setRecords(prev => prev.map(r => r.id === existing.id ? { ...r, ...recordData } : r));
    } else {
      setRecords(prev => [...prev, { id: nextId(prev), ...recordData }]);
    }
    navigate("manager-records");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать пластинку" : "Добавить пластинку"} />

      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Название" value={title} onChange={setTitle} placeholder="Название альбома" required className="md:col-span-2" />
            <SelectInput label="Ансамбль" value={ensembleId} onChange={setEnsembleId}
              options={ensembles.map(e => ({ value: String(e.id), label: e.name }))} />
            <FormInput label="Каталожный номер" value={catalogNumber} onChange={setCatalogNumber} placeholder="C10-12345" required />
            <FormInput label="Лейбл" value={label} onChange={setLabel} placeholder="Мелодия" required />
            <FormInput label="Адрес поставщика" value={supplier} onChange={setSupplier} placeholder="ООО «Поставщик»" className="md:col-span-2" />
            <FormInput label="Год выпуска" type="number" value={year} onChange={setYear} placeholder="1978" required />
            <FormInput label="Жанр" value={genre} onChange={setGenre} placeholder="Классика" />
            <FormInput label="Оптовая цена (₽)" type="number" value={wholesalePrice} onChange={setWholesalePrice} placeholder="1200" required />
            <FormInput label="Розничная цена (₽)" type="number" value={price} onChange={setPrice} placeholder="2400" required />
            <SelectInput label="Филиал" value={branchId} onChange={setBranchId}
              options={branches.map(b => ({ value: String(b.id), label: b.name }))} />
            <FormInput label="Кол-во на складе" type="number" value={quantity} onChange={setQuantity} placeholder="0" />
            <FormInput label="URL обложки" value={cover} onChange={setCover} placeholder="https://..." className="md:col-span-2" />
          </div>

          {cover && (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 overflow-hidden bg-secondary border border-border">
                <img src={cover} alt="Обложка" className="w-full h-full object-cover" />
              </div>
              <p className="text-muted-foreground text-xs">Предпросмотр обложки</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("manager-records")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
