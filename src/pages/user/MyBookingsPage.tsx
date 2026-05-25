import { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, StatusBadge, Btn } from "../../components/ui";
import { formatDate, formatDateTime } from "../../utils/helpers";

type Filter = "all" | "active" | "completed" | "cancelled" | "expired";

export default function MyBookingsPage() {
  const { navigate, role, bookings, setBookings, records, ensembles, branches, currentUser } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  if (role === "guest") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Войдите, чтобы видеть свои брони</p>
        <Btn variant="primary" onClick={() => navigate("login")}>Войти</Btn>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === currentUser?.id);
  const filtered = filter === "all" ? userBookings : userBookings.filter(b => b.status === filter);
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function cancelBooking(id: number) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
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

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-border mb-8 flex-wrap">
        {tabs.map(t => {
          const count = t.key === "all" ? userBookings.length : userBookings.filter(b => b.status === t.key).length;
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
          <Btn variant="outline" onClick={() => navigate("records")} className="mt-4">
            Смотреть каталог
          </Btn>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(booking => {
            const record = records.find(r => r.id === booking.recordId);
            const ensemble = record ? ensembles.find(e => e.id === record.ensembleId) : null;
            const branch = branches.find(b => b.id === booking.branchId);
            if (!record) return null;

            return (
              <div key={booking.id}
                className={`bg-card border p-5 transition-colors ${
                  booking.status === "active" ? "border-green-900/40" :
                  booking.status === "expired" ? "border-red-900/40" : "border-border"
                }`}>
                <div className="flex items-start gap-5">
                  {/* Cover */}
                  <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-secondary">
                    <img src={record.cover} alt={record.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <button onClick={() => navigate("record", { id: record.id })}
                          className="font-medium text-foreground hover:text-primary transition-colors text-sm leading-snug">
                          {record.title}
                        </button>
                        <p className="text-muted-foreground text-xs mt-0.5">{ensemble?.name}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs text-muted-foreground">
                      <div>
                        <p className="text-muted-foreground/60 mb-0.5">№ брони</p>
                        <p className="font-data text-foreground">#{booking.id}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-muted-foreground/60 mb-0.5">Филиал</p>
                        <p className="flex items-center gap-1 text-foreground">
                          <MapPin size={10} className="text-primary/60 flex-shrink-0" />{branch?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground/60 mb-0.5">Создана</p>
                        <p className="flex items-center gap-1 text-foreground">
                          <Calendar size={10} className="text-primary/60" />{formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground/60 mb-0.5">Дедлайн</p>
                        <p className={booking.status === "active" && new Date(booking.deadline) > new Date() ? "text-green-400" : "text-foreground"}>
                          {formatDateTime(booking.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                  {booking.status === "active" && (
                    <Btn variant="danger" onClick={() => cancelBooking(booking.id)} className="text-xs py-1.5">
                      Отменить бронь
                    </Btn>
                  )}
                  {booking.status !== "active" && (
                    <Btn variant="outline" onClick={() => navigate("record", { id: record.id })} className="text-xs py-1.5">
                      Забронировать снова
                    </Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
