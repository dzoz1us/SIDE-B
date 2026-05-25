import { useApp } from "../context/AppContext";
import { Btn } from "../components/ui";
import { Disc3 } from "lucide-react";

export default function NotFound() {
  const { navigate } = useApp();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="mb-8 opacity-20">
        <Disc3 size={80} className="text-primary mx-auto animate-spin" style={{ animationDuration: "8s" }} />
      </div>
      <p className="font-data text-primary text-sm tracking-widest mb-3">404</p>
      <h1 className="font-display text-4xl font-medium text-foreground mb-4">Страница не найдена</h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        Кажется, эта дорожка не записана. Вернитесь на главную и продолжите поиск.
      </p>
      <Btn variant="primary" onClick={() => navigate("home")}>На главную</Btn>
    </div>
  );
}
