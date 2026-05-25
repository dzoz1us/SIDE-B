import { Users, Music, Building2, UserCog, FileText } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function AdminDashboard() {
  const { navigate, ensembles, musicians, branches, users } = useApp();
  const managers = users.filter(u => u.role === "manager");

  const cards = [
    { label: "Ансамбли", sub: `${ensembles.length} коллективов`, icon: <Music size={22} />, page: "admin-ensembles" },
    { label: "Музыканты", sub: `${musicians.length} музыкантов`, icon: <Users size={22} />, page: "admin-musicians" },
    { label: "Произведения", sub: "Каталог произведений", icon: <Music size={22} />, page: "admin-compositions" },
    { label: "Филиалы", sub: `${branches.length} филиалов`, icon: <Building2 size={22} />, page: "admin-branches" },
    { label: "Менеджеры", sub: `${managers.length} сотрудников`, icon: <UserCog size={22} />, page: "admin-managers" },
    { label: "Логи действий", sub: "История операций", icon: <FileText size={22} />, page: "admin-logs" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-10">
        <p className="text-primary text-xs tracking-[0.25em] uppercase mb-2">Администрирование</p>
        <h1 className="font-display text-3xl font-bold text-foreground">Административная панель</h1>
        <div className="mt-3 h-0.5 w-16 bg-primary/60" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {cards.map(card => (
          <button key={card.page} onClick={() => navigate(card.page)}
            className="group bg-card border border-border p-7 text-left hover:border-primary/40 hover:bg-secondary/20 transition-all duration-200">
            <div className="text-primary/60 group-hover:text-primary transition-colors mb-4">
              {card.icon}
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {card.label}
            </h3>
            <p className="text-muted-foreground text-xs">{card.sub}</p>
            <div className="mt-5 h-px w-8 bg-primary/20 group-hover:w-16 group-hover:bg-primary/50 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
