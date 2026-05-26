import { useState, useEffect } from "react";
import { Users, Music, Building2, UserCog, FileText, Disc } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getEnsembles } from "../../services/ensembles";
import { getBranches } from "../../services/branches";
import { getRecords } from "../../services/records";

export default function AdminDashboard() {
  const { navigate } = useApp();
  const [ensemblesCount, setEnsemblesCount] = useState(0);
  const [branchesCount, setBranchesCount] = useState(0);
  const [recordsCount, setRecordsCount] = useState(0);

  useEffect(() => {
    getEnsembles().then(data => setEnsemblesCount(data.length));
    getBranches().then(data => setBranchesCount(data.length));
    getRecords().then(data => setRecordsCount(data.length));
  }, []);

  const cards = [
    { label: "Ансамбли", sub: `${ensemblesCount} коллективов`, icon: <Music size={22} />, page: "admin-ensembles" },
    { label: "Музыканты", sub: "Управление музыкантами", icon: <Users size={22} />, page: "admin-musicians" },
    { label: "Пластинки", sub: `${recordsCount} пластинок`, icon: <Disc size={22} />, page: "manager-records" },
    { label: "Произведения", sub: "Каталог произведений", icon: <Music size={22} />, page: "admin-compositions" },
    { label: "Филиалы", sub: `${branchesCount} филиалов`, icon: <Building2 size={22} />, page: "admin-branches" },
    { label: "Менеджеры", sub: "Управление сотрудниками", icon: <UserCog size={22} />, page: "admin-managers" },
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
            <div className="text-primary/60 group-hover:text-primary transition-colors mb-4">{card.icon}</div>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{card.label}</h3>
            <p className="text-muted-foreground text-xs">{card.sub}</p>
            <div className="mt-5 h-px w-8 bg-primary/20 group-hover:w-16 group-hover:bg-primary/50 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}