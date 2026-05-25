import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, FormInput, FormTextarea } from "../../components/ui";
import { nextId } from "../../utils/helpers";

export default function AdminBranchForm() {
  const { params, navigate, branches, setBranches } = useApp();
  const isEdit = params.mode === "edit";
  const existing = isEdit ? branches.find(b => b.id === params.branchId) : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [hours, setHours] = useState(existing?.hours ?? "");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data = { name, address, phone, hours };
    if (isEdit && existing) {
      setBranches(prev => prev.map(b => b.id === existing.id ? { ...b, ...data } : b));
    } else {
      setBranches(prev => [...prev, { id: nextId(prev), ...data }]);
    }
    navigate("admin-branches");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать филиал" : "Добавить филиал"} />
      <button
        onClick={() => navigate("admin-branches")}
        className="text-xs text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-1"
      >
        ← Вернуться к филиалам
      </button>

      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <FormInput
            label="Название филиала"
            value={name}
            onChange={setName}
            placeholder="Центральный магазин"
            required
          />
          <FormInput
            label="Адрес"
            value={address}
            onChange={setAddress}
            placeholder="г. Москва, ул. Пушкина, д. 1"
            required
          />
          <FormInput
            label="Телефон"
            value={phone}
            onChange={setPhone}
            placeholder="+7 (495) 000-00-00"
            required
          />
          <FormInput
            label="Часы работы"
            value={hours}
            onChange={setHours}
            placeholder="Пн–Вс: 10:00–22:00"
            required
          />

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-branches")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
