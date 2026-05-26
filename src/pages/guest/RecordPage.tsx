import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { getRecord } from "../../services/records";
import { getBranches } from "../../services/branches";
import { createReservation } from "../../services/reservations";
import { Btn, Modal, Badge, SelectInput } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { RecordDetail, Branch } from "../../types";

export default function RecordPage() {
  const { params, navigate } = useApp();
  const { user } = useAuth();
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [bookingDone, setBookingDone] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      Promise.all([getRecord(params.id), getBranches()])
        .then(([recordData, branchesData]) => {
          setRecord(recordData);
          setBranches(branchesData);
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;
  if (!record) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Пластинка не найдена</div>;

  const branchOptions = branches.map(b => ({ value: String(b.id), label: `${b.name}` }));

  async function handleBook() {
    if (!selectedBranchId || !user) return;
    try {
      await createReservation(record!.id, Number(selectedBranchId));
      setBookingDone(true);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Ошибка бронирования");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-8">
        <button onClick={() => navigate("records")} className="hover:text-primary transition-colors">Пластинки</button>
        <ChevronRight size={12} />
        <span className="text-foreground">{record.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="aspect-square overflow-hidden bg-card border border-border">
            <img src={record.cover_image || ""} alt={record.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground leading-snug mb-3">{record.title}</h1>
            <button onClick={() => navigate("ensemble", { id: record.ensemble.id })}
              className="text-primary hover:text-primary/80 transition-colors font-medium text-lg">
              {record.ensemble.name}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-5 border-t border-b border-border">
            {[
              { label: "Год выпуска", value: record.release_date?.slice(0, 4) || "—" },
              { label: "Лейбл", value: record.label || "—" },
              { label: "Каталожный номер", value: record.catalogue_number },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-foreground text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary">{formatPrice(Number(record.retail_price))}</span>
          </div>

          <div>
            {record.stock_quantity > 0
              ? <Badge variant="success">В наличии: {record.stock_quantity} шт.</Badge>
              : <Badge variant="danger">Нет в наличии</Badge>}
          </div>

          {!user ? (
            <Btn variant="outline" onClick={() => navigate("login")} className="py-3 justify-center">Войдите, чтобы забронировать</Btn>
          ) : bookingDone ? (
            <div className="bg-green-900/20 border border-green-900/40 text-green-400 text-sm px-4 py-3">
              Бронь успешно создана! <button onClick={() => navigate("my-bookings")} className="underline">Мои брони →</button>
            </div>
          ) : (
            <Btn variant="primary" onClick={() => setBookingOpen(true)} disabled={record.stock_quantity === 0}
              className="py-3 justify-center text-base">
              {record.stock_quantity > 0 ? "Забронировать" : "Нет в наличии"}
            </Btn>
          )}
        </div>
      </div>

      {record.tracks.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Треклист</h2>
          <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mb-6" />
          <div className="border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">№</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Название</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Композитор</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Длительность</th>
                </tr>
              </thead>
              <tbody>
                {record.tracks.map(track => (
                  <tr key={track.track_number} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-data">{track.track_number}</td>
                    <td className="px-4 py-3 text-foreground">{track.composition.title}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{track.composition.composer_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground font-data text-xs text-right">{Math.floor(track.composition.duration / 60)}:{String(track.composition.duration % 60).padStart(2, "0")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Забронировать пластинку">
        <div className="flex items-center gap-4 mb-5 p-3 bg-secondary border border-border">
          <img src={record.cover_image || ""} alt={record.title} className="w-14 h-14 object-cover flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground text-sm">{record.title}</p>
            <p className="text-muted-foreground text-xs">{record.ensemble.name}</p>
            <p className="text-primary text-sm font-medium mt-1">{formatPrice(Number(record.retail_price))}</p>
          </div>
        </div>
        <SelectInput label="Выберите филиал" value={selectedBranchId} onChange={setSelectedBranchId}
          options={[{ value: "", label: "— Выберите филиал —" }, ...branchOptions]} className="mb-4" />
        <div className="bg-secondary/60 border border-border p-3 text-xs text-muted-foreground mb-5">
          <p className="font-medium text-foreground mb-1">Условия бронирования</p>
          <p>Бронь действует 48 часов.</p>
        </div>
        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={() => setBookingOpen(false)}>Отмена</Btn>
          <Btn variant="primary" onClick={() => { handleBook(); setBookingOpen(false); }} disabled={!selectedBranchId}>Подтвердить бронь</Btn>
        </div>
      </Modal>
    </div>
  );
}