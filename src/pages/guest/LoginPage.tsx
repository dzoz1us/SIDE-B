import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/auth";
import { Btn, FormInput } from "../../components/ui";

export default function LoginPage() {
  const { navigate } = useApp();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
      navigate("home");
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || "Неверный email или пароль";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-bold text-primary mb-2 tracking-[0.15em]">SIDE B</div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Вход в аккаунт</h1>
          <p className="text-muted-foreground text-sm mt-2">Войдите, чтобы бронировать пластинки</p>
        </div>

        <div className="bg-card border border-border p-7">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <FormInput label="Email" type="email" placeholder="your@email.com"
              value={email} onChange={setEmail} required />
            <FormInput label="Пароль" type="password" placeholder="••••••••"
              value={password} onChange={setPassword} required />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <Btn type="submit" variant="primary" className="w-full justify-center py-2.5 mt-1" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Btn>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => navigate("register")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
            </button>
          </div>
        </div>

        <div className="mt-5 bg-card border border-border/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Тестовый доступ</p>
          <p className="text-xs text-muted-foreground">
            Администратор: <span className="text-foreground">admin@vinyl.ru</span> / <span className="text-foreground">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}