import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, FormInput } from "../../components/ui";
import { nextId } from "../../utils/helpers";

export default function AdminManagerForm() {
  const { params, navigate, users, setUsers } = useApp();
  const isEdit = params.mode === "edit";
  const existing = isEdit ? users.find(u => u.id === params.managerId) : null;

  const [firstName, setFirstName] = useState(existing?.firstName ?? "");
  const [lastName, setLastName] = useState(existing?.lastName ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isEdit && password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!isEdit && password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return;
    }

    const emailExists = users.some(u => u.email === email && u.id !== existing?.id);
    if (emailExists) {
      setError("Пользователь с таким email уже существует");
      return;
    }

    const now = new Date().toISOString();

    if (isEdit && existing) {
      setUsers(prev => prev.map(u =>
        u.id === existing.id ? { ...u, firstName, lastName, email } : u
      ));
    } else {
      setUsers(prev => [...prev, {
        id: nextId(prev),
        firstName,
        lastName,
        email,
        role: "manager",
        status: "active",
        createdAt: now,
      }]);
    }
    navigate("admin-managers");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать менеджера" : "Добавить менеджера"} />
      <button
        onClick={() => navigate("admin-managers")}
        className="text-xs text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-1"
      >
        ← Вернуться к менеджерам
      </button>

      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <FormInput label="Имя" value={firstName} onChange={setFirstName} placeholder="Имя" required />
            <FormInput label="Фамилия" value={lastName} onChange={setLastName} placeholder="Фамилия" required />
          </div>
          <FormInput label="Email" type="email" value={email} onChange={setEmail} placeholder="manager@sideb.ru" required />

          {!isEdit && (
            <>
              <FormInput label="Пароль" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
              <FormInput label="Подтвердите пароль" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" required />
            </>
          )}

          {isEdit && (
            <div className="bg-secondary/50 border border-border px-4 py-3 text-xs text-muted-foreground">
              Для смены пароля используйте функцию сброса пароля.
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">{error}</p>
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
