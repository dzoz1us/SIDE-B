import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Btn, FormInput } from "../../components/ui";

export default function LoginPage() {
  const { navigate, setRole } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const demoAccounts = [
    { email: "ivan@example.com", label: "Пользователь", role: "user" as const },
    { email: "dmitry@sideb.ru", label: "Менеджер", role: "manager" as const },
    { email: "admin@sideb.ru", label: "Администратор", role: "admin" as const },
  ];

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const demo = demoAccounts.find(a => a.email === email);
    if (demo && password === "demo") {
      setRole(demo.role);
      navigate("home");
    } else {
      setError("Неверный email или пароль. Используйте демо-аккаунт.");
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
            <Btn type="submit" variant="primary" className="w-full justify-center py-2.5 mt-1">
              Войти
            </Btn>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => navigate("register")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
            </button>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-5 bg-card border border-border/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Демо-аккаунты (пароль: demo)</p>
          <div className="flex flex-col gap-2">
            {demoAccounts.map(acc => (
              <button key={acc.role}
                onClick={() => { setRole(acc.role); navigate("home"); }}
                className="flex items-center justify-between text-xs text-left px-3 py-2 bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/30 transition-colors">
                <span className="text-foreground">{acc.label}</span>
                <span className="text-muted-foreground">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
