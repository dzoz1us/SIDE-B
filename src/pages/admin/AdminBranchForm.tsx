import { useState } from "react";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";
import { PageTitle, Btn, FormInput } from "../../components/ui";

export default function AdminBranchForm() {
  const { params, navigate } = useApp();
  const isEdit = params.mode === "edit";

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data = { name, address, phone, opening_hours: openingHours };
    if (isEdit && params.branchId) {
      await api.patch(`/branches/${params.branchId}/`, data);
    } else {
      await api.post("/branches/", data);
    }
    navigate("admin-branches");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать филиал" : "Добавить филиал"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <FormInput label="Название филиала" value={name} onChange={setName} placeholder="Центральный магазин" required />
          <FormInput label="Адрес" value={address} onChange={setAddress} placeholder="г. Москва, ул. Пушкина, д. 1" required />
          <FormInput label="Телефон" value={phone} onChange={setPhone} placeholder="+7 (495) 000-00-00" required />
          <FormInput label="Часы работы" value={openingHours} onChange={setOpeningHours} placeholder="Пн–Вс: 10:00–22:00" required />
          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-branches")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}