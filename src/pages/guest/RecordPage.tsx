import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Btn, Modal, Badge, SelectInput } from "../../components/ui";
import { formatPrice, formatDateTime, deadline48h, nextId } from "../../utils/helpers";

export default function RecordPage() {
  const { params, navigate, role, records, ensembles, recordBranches, branches, tracks, compositions, musicians, bookings, setBookings, currentUser } = useApp();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [bookingDone, setBookingDone] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);

  const record = records.find(r => r.id === params.id);
  if (!record) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Пластинка не найдена</div>;

  const ensemble = ensembles.find(e => e.id === record.ensembleId);
  const recordBranchData = recordBranches.filter(rb => rb.recordId === record.id);
  const totalStock = recordBranchData.reduce((s, rb) => s + rb.quantity, 0);
  const recordTracks = tracks.filter(t => t.recordId === record.id).sort((a, b) => a.trackNumber - b.trackNumber);
  const availableBranches = recordBranchData.filter(rb => rb.quantity > 0);
  const branchOptions = availableBranches.map(rb => {
    const branch = branches.find(b => b.id === rb.branchId)!;
    return { value: String(rb.branchId), label: `${branch.name} — ${rb.quantity} шт.` };
  });

  const deadlineStr = deadline48h();

  function handleBook() {
    if (!selectedBranchId || !currentUser) return;
    const newBooking = {
      id: nextId(bookings),
      userId: currentUser.id,
      recordId: record.id,
      branchId: Number(selectedBranchId),
      status: "active" as const,
      createdAt: new Date().toISOString(),
      deadline: deadlineStr,
    };
    setBookings(prev => [...prev, newBooking]);
    setBookingDone(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-8">
        <button onClick={() => navigate("records")} className="hover:text-primary transition-colors">Пластинки</button>
        <ChevronRight size={12} />
        <span className="text-foreground">{record.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Cover */}
        <div>
          <div className="aspect-square overflow-hidden bg-card border border-border">
            <img src={record.cover} alt={record.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground leading-snug mb-3">{record.title}</h1>
            <button onClick={() => navigate("ensemble", { id: ensemble?.id })}
              className="text-primary hover:text-primary/80 transition-colors font-medium text-lg">
              {ensemble?.name}
            </button>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-5 border-t border-b border-border">
            {[
              { label: "Год выпуска", value: String(record.year) },
              { label: "Лейбл", value: record.label },
              { label: "Каталожный номер", value: record.catalogNumber },
              { label: "Жанр", value: record.genre },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-foreground text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary">{formatPrice(record.price)}</span>
            <span className="text-muted-foreground text-sm">розничная цена</span>
          </div>

          {/* Stock */}
          <div>
            {totalStock > 0
              ? <div className="flex items-center gap-2"><Badge variant="success">В наличии: {totalStock} шт.</Badge></div>
              : <Badge variant="danger">Нет в наличии</Badge>
            }
          </div>

          {/* Branches availability */}
          {recordBranchData.length > 0 && (
            <div className="bg-card border border-border">
              <button onClick={() => setBranchesOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors">
                <span>Наличие по филиалам</span>
                <ChevronDown size={14} className={`transition-transform ${branchesOpen ? "rotate-180" : ""}`} />
              </button>
              {branchesOpen && (
                <div className="border-t border-border">
                  {recordBranchData.map(rb => {
                    const branch = branches.find(b => b.id === rb.branchId);
                    if (!branch) return null;
                    return (
                      <div key={rb.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 last:border-0 text-sm">
                        <span className="text-foreground">{branch.name}</span>
                        {rb.quantity > 0
                          ? <Badge variant="success">{rb.quantity} шт.</Badge>
                          : <Badge variant="danger">Нет</Badge>
                        }
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Booking button */}
          {role === "guest" ? (
            <Btn variant="outline" onClick={() => navigate("login")} className="py-3 justify-center">
              Войдите, чтобы забронировать
            </Btn>
          ) : bookingDone ? (
            <div className="bg-green-900/20 border border-green-900/40 text-green-400 text-sm px-4 py-3">
              Бронь успешно создана! <button onClick={() => navigate("my-bookings")} className="underline">Мои брони →</button>
            </div>
          ) : (
            <Btn variant="primary" onClick={() => { setBookingOpen(true); setBookingDone(false); }}
              disabled={totalStock === 0} className="py-3 justify-center text-base">
              {totalStock > 0 ? "Забронировать" : "Нет в наличии"}
            </Btn>
          )}
        </div>
      </div>

      {/* Tracklist */}
      {recordTracks.length > 0 && (
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
                {recordTracks.map(track => {
                  const comp = compositions.find(c => c.id === track.compositionId);
                  const compositor = comp ? musicians.find(m => m.id === comp.compositorId) : null;
                  return (
                    <tr key={track.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground font-data">{track.trackNumber}</td>
                      <td className="px-4 py-3 text-foreground">{comp?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {compositor ? `${compositor.firstName} ${compositor.lastName}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-data text-xs text-right">{comp?.duration ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking modal */}
      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Забронировать пластинку">
        <div className="flex items-center gap-4 mb-5 p-3 bg-secondary border border-border">
          <img src={record.cover} alt={record.title} className="w-14 h-14 object-cover flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground text-sm">{record.title}</p>
            <p className="text-muted-foreground text-xs">{ensemble?.name}</p>
            <p className="text-primary text-sm font-medium mt-1">{formatPrice(record.price)}</p>
          </div>
        </div>

        {branchOptions.length === 0 ? (
          <p className="text-muted-foreground text-sm mb-5">Пластинка недоступна ни в одном филиале.</p>
        ) : (
          <>
            <SelectInput
              label="Выберите филиал"
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              options={[{ value: "", label: "— Выберите филиал —" }, ...branchOptions]}
              className="mb-4"
            />
            <div className="bg-secondary/60 border border-border p-3 text-xs text-muted-foreground mb-5">
              <p className="font-medium text-foreground mb-1">Условия бронирования</p>
              <p>Бронь действует 48 часов.</p>
              <p>Заберите пластинку до <span className="text-primary">{formatDateTime(deadlineStr)}</span></p>
            </div>
          </>
        )}

        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={() => setBookingOpen(false)}>Отмена</Btn>
          <Btn variant="primary" onClick={() => { handleBook(); setBookingOpen(false); }}
            disabled={!selectedBranchId}>
            Подтвердить бронь
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
