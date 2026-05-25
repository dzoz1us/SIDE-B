import { useApp } from "../context/AppContext";
import { Btn } from "../components/ui";
import { Lock } from "lucide-react";

export default function Forbidden() {
  const { navigate, role } = useApp();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="mb-8 opacity-20">
        <Lock size={80} className="text-primary mx-auto" />
      </div>
      <p className="font-data text-primary text-sm tracking-widest mb-3">403</p>
      <h1 className="font-display text-4xl font-medium text-foreground mb-4">Доступ запрещён</h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        У вас недостаточно прав для просмотра этой страницы.
      </p>
      <div className="flex gap-3">
        <Btn variant="ghost" onClick={() => navigate("home")}>На главную</Btn>
        {role === "guest" && (
          <Btn variant="primary" onClick={() => navigate("login")}>Войти</Btn>
        )}
      </div>
    </div>
  );
}
