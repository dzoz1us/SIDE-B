import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getMyReservations } from "../../services/reservations";
import api from "../../services/api";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, SelectInput } from "../../components/ui";
import { formatDateTime } from "../../utils/helpers";

export default function ManagerActiveBookings() {
  const { navigate, branches } = useApp();
  const [bookings, setBookings] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reservations/").then(res => {
      setBookings(res.data.results || res.data);
      setLoading(false);
    });
  }, []);

  const activeBookings = bookings.filter(b => b.status_name === "active");
  const filtered = branchFilter === "all" ? activeBookings : activeBookings.filter(b => b.branch_name === branches.find(bn => bn.id === Number(branchFilter))?.name);

  async function handleComplete(id: number) {
    await api.post(`/reservations/${id}/complete/`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status_name: "completed" } : b));
  }

  async function handleExpire(id: number) {
    await api.post(`/reservations/${id}/expire/`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status_name: "expired" } : b));
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Активные брони" subtitle={`${activeBookings.length} активных`} />
      <div className="mb-6 flex items-center gap-4">
        <SelectInput value={branchFilter} onChange={setBranchFilter}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="min-w-[200px]" />
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>№ брони</Th>
            <Th>Пластинка</Th>
            <Th>Филиал</Th>
            <Th>Дедлайн</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(booking => (
            <Tr key={booking.id}>
              <Td><span className="font-data text-xs">#{booking.id}</span></Td>
              <Td><span className="text-xs">{booking.record_title}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{booking.branch_name}</span></Td>
              <Td><span className="text-xs font-data">{formatDateTime(booking.expires_at)}</span></Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Btn variant="outline" onClick={() => handleComplete(booking.id)} className="text-xs py-1 px-2">Выдать</Btn>
                  <Btn variant="danger" onClick={() => handleExpire(booking.id)} className="text-xs py-1 px-2">Снять</Btn>
                </div>
              </Td>
            </Tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Активных броней нет</td></tr>
          )}
        </tbody>
      </TableWrap>
    </div>
  );
}