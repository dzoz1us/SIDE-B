import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { register } from "../../services/auth";
import { Btn, FormInput } from "../../components/ui";

export default function RegisterPage() {
  const { navigate } = useApp();
  const { setUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Пароли не совпадают"); return; }
    if (password.length < 6) { setError("Пароль должен содержать минимум 6 символов"); return; }
    setError("");
    setLoading(true);
    try {
      const data = await register(email, password, firstName, lastName);
      setUser(data.user);
      navigate("home");
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.detail || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-bold text-primary mb-2 tracking-[0.15em]">SIDE B</div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Регистрация</h1>
          <p className="text-muted-foreground text-sm mt-2">Создайте аккаунт для бронирования</p>
        </div>

        <div className="bg-card border border-border p-7">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Имя" placeholder="Иван" value={firstName} onChange={setFirstName} required />
              <FormInput label="Фамилия" placeholder="Иванов" value={lastName} onChange={setLastName} required />
            </div>
            <FormInput label="Email" type="email" placeholder="your@email.com" value={email} onChange={setEmail} required />
            <FormInput label="Пароль" type="password" placeholder="Минимум 6 символов" value={password} onChange={setPassword} required />
            <FormInput label="Подтверждение пароля" type="password" placeholder="Повторите пароль" value={confirm} onChange={setConfirm} required />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <Btn type="submit" variant="primary" className="w-full justify-center py-2.5 mt-1" disabled={loading}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Btn>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => navigate("login")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Уже есть аккаунт? <span className="text-primary">Войти</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}