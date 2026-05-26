import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { getMyReservations, cancelReservation } from "../../services/reservations";
import { PageTitle, StatusBadge, Btn } from "../../components/ui";
import { formatDate, formatDateTime } from "../../utils/helpers";
import { Reservation } from "../../types";

type Filter = "all" | "active" | "completed" | "cancelled" | "expired";

const STATUS_MAP: Record<string, string> = {
  active: "active",
  completed: "completed",
  cancelled: "cancelled",
  expired: "expired",
};

export default function MyBookingsPage() {
  const { navigate } = useApp();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    console.log("MyBookingsPage: user =", user, "authLoading =", authLoading);
    if (!authLoading && user) {
      getMyReservations()
        .then(data => {
          console.log("Брони загружены:", data);
          setBookings(Array.isArray(data) ? data : []);
          setError("");
        })
        .catch(err => {
          console.error("Ошибка загрузки броней:", err);
          setError(err.response?.data?.detail || "Ошибка загрузки");
          setBookings([]);
        })
        .finally(() => setLoading(false));
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Проверка авторизации...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Войдите, чтобы видеть свои брони</p>
        <Btn variant="primary" onClick={() => navigate("login")}>Войти</Btn>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка броней...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 mb-2">Ошибка: {error}</p>
        <Btn variant="outline" onClick={() => window.location.reload()}>Попробовать снова</Btn>
      </div>
    );
  }

  const filtered = filter === "all" ? bookings : bookings.filter(b => STATUS_MAP[b.status_name] === filter);
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  async function handleCancel(id: number) {
    try {
      await cancelReservation(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status_name: "cancelled" } : b));
    } catch (err: any) {
      alert(err.response?.data?.error || "Ошибка отмены");
    }
  }

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "active", label: "Активные" },
    { key: "completed", label: "Завершённые" },
    { key: "cancelled", label: "Отменённые" },
    { key: "expired", label: "Просроченные" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Мои брони" />

      <div className="flex gap-0 border-b border-border mb-8 flex-wrap">
        {tabs.map(t => {
          const count = t.key === "all" ? bookings.length : bookings.filter(b => STATUS_MAP[b.status_name] === t.key).length;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                filter === t.key
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
              {count > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 ${filter === t.key ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-3 opacity-20">◎</div>
          <p className="text-muted-foreground">
            {filter === "all" ? "У вас пока нет броней" : "Броней с данным статусом нет"}
          </p>
          <Btn variant="outline" onClick={() => navigate("records")} className="mt-4">Смотреть каталог</Btn>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(booking => (
            <div key={booking.id}
              className={`bg-card border p-5 transition-colors ${
                booking.status_name === "active" ? "border-green-900/40" :
                booking.status_name === "expired" ? "border-red-900/40" : "border-border"
              }`}>
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-secondary">
                  <img src={booking.record_cover || ""} alt={booking.record_title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <h3 className="font-medium text-foreground text-sm leading-snug">{booking.record_title}</h3>
                    </div>
                    <StatusBadge status={STATUS_MAP[booking.status_name] || "active"} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs text-muted-foreground">
                    <div>
                      <p className="text-muted-foreground/60 mb-0.5">№ брони</p>
                      <p className="font-data text-foreground">#{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/60 mb-0.5">Филиал</p>
                      <p className="flex items-center gap-1 text-foreground">
                        <MapPin size={10} className="text-primary/60 flex-shrink-0" />{booking.branch_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/60 mb-0.5">Создана</p>
                      <p className="flex items-center gap-1 text-foreground">
                        <Calendar size={10} className="text-primary/60" />{formatDate(booking.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/60 mb-0.5">Дедлайн</p>
                      <p className={booking.status_name === "active" && new Date(booking.expires_at) > new Date() ? "text-green-400" : "text-foreground"}>
                        {formatDateTime(booking.expires_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                {booking.status_name === "active" && (
                  <Btn variant="danger" onClick={() => handleCancel(booking.id)} className="text-xs py-1.5">
                    Отменить бронь
                  </Btn>
                )}
                {booking.status_name !== "active" && (
                  <Btn variant="outline" onClick={() => navigate("records")} className="text-xs py-1.5">
                    Забронировать снова
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}