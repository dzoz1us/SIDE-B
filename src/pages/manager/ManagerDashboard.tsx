import { Disc, BookOpen, TrendingUp, AlertTriangle, Plus, Package } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Btn } from "../../components/ui";
import { useEffect, useState } from "react";
import { getRecords } from "../../services/records";
import { getMyReservations } from "../../services/reservations";

export default function ManagerDashboard() {
  const { navigate } = useApp();
  const { user } = useAuth();
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [soldThisYear, setSoldThisYear] = useState(0);

  useEffect(() => {
    getRecords().then(data => {
      setTotalRecords(data.length);
      setSoldThisYear(data.reduce((s, r) => s + r.sold_current_year, 0));
    });
    getMyReservations().then(data => {
      setActiveBookings(data.filter(b => b.status_name === "active").length);
    });
  }, []);

  const stats = [
    { label: "Всего пластинок в каталоге", value: totalRecords, icon: <Disc size={20} />, color: "text-primary" },
    { label: "Активных броней", value: activeBookings, icon: <BookOpen size={20} />, color: "text-green-400" },
    { label: "Продано за текущий год", value: soldThisYear, icon: <TrendingUp size={20} />, color: "text-blue-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Добро пожаловать, {user?.first_name || "Менеджер"}
        </h1>
        <p className="text-muted-foreground mt-1">Панель управления магазина</p>
        <div className="mt-3 h-0.5 w-16 bg-primary/60" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card border border-border p-6">
            <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
            <p className="text-muted-foreground text-xs mt-1.5 leading-snug">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-5">Быстрые действия</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Добавить пластинку", icon: <Plus size={18} />, page: "manager-record-form", params: { mode: "add" } },
            { label: "Активные брони", icon: <BookOpen size={18} />, page: "manager-active-bookings", params: {} },
            { label: "Склад", icon: <Package size={18} />, page: "manager-warehouse", params: {} },
            { label: "Офлайн-продажа", icon: <Disc size={18} />, page: "manager-offline-sale", params: {} },
          ].map(action => (
            <button key={action.label}
              onClick={() => navigate(action.page, action.params)}
              className="bg-card border border-border p-5 flex flex-col items-start gap-3 hover:border-primary/40 hover:bg-secondary/30 transition-all text-left group">
              <div className="text-primary/70 group-hover:text-primary transition-colors">{action.icon}</div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}