import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";
import { PageTitle, Btn, FormInput } from "../../components/ui";

export default function AdminManagerForm() {
  const { params, navigate } = useApp();
  const isEdit = params.mode === "edit";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isEdit && params.managerId) {
      api.get(`/auth/managers/${params.managerId}/`).then(res => {
        setFirstName(res.data.first_name || "");
        setLastName(res.data.last_name || "");
        setEmail(res.data.email || "");
      });
    }
  }, [isEdit, params.managerId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data: any = { email, first_name: firstName, last_name: lastName };
    if (!isEdit && password) data.password = password;

    if (isEdit && params.managerId) {
      await api.patch(`/auth/managers/${params.managerId}/`, data);
    } else {
      await api.post("/auth/managers/create/", data);
    }
    navigate("admin-managers");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать менеджера" : "Добавить менеджера"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <FormInput label="Имя" value={firstName} onChange={setFirstName} required />
            <FormInput label="Фамилия" value={lastName} onChange={setLastName} required />
          </div>
          <FormInput label="Email" type="email" value={email} onChange={setEmail} required />
          {!isEdit && (
            <FormInput label="Пароль" type="password" value={password} onChange={setPassword} required />
          )}
          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-managers")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}