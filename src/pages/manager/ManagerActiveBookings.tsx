import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, SelectInput } from "../../components/ui";
import { formatDateTime, getTimeUntil, getTimeBgClass } from "../../utils/helpers";

export default function ManagerActiveBookings() {
  const { navigate, bookings, setBookings, setRecords, records, users, branches } = useApp();
  const [branchFilter, setBranchFilter] = useState("all");

  const activeBookings = bookings.filter(b => b.status === "active");
  const filtered = branchFilter === "all"
    ? activeBookings
    : activeBookings.filter(b => b.branchId === Number(branchFilter));

  const expiredOnes = activeBookings.filter(b => new Date(b.deadline) < new Date());

  function handleGive(bookingId: number) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    setBookings(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: "completed" as const, completedAt: new Date().toISOString() }
      : b));
    setRecords(prev => prev.map(r => r.id === booking.recordId
      ? { ...r, soldCurrentYear: r.soldCurrentYear + 1 }
      : r));
  }

  function handleExpire(bookingId: number) {
    setBookings(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: "expired" as const }
      : b));
  }

  function handleExpireAll() {
    const now = new Date();
    setBookings(prev => prev.map(b =>
      b.status === "active" && new Date(b.deadline) < now
        ? { ...b, status: "expired" as const }
        : b
    ));
  }

  const { records: allRecords } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Активные брони"
        subtitle={`${activeBookings.length} активных · ${expiredOnes.length} просроченных`}
        action={expiredOnes.length > 0 ? (
          <Btn variant="danger" onClick={handleExpireAll}>
            Снять все просроченные ({expiredOnes.length})
          </Btn>
        ) : undefined}
      />

      <div className="mb-6 flex items-center gap-4">
        <SelectInput value={branchFilter} onChange={setBranchFilter}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="min-w-[200px]" />
      </div>

      <TableWrap>
        <thead>
          <tr>
            <Th>№ брони</Th>
            <Th>Пользователь</Th>
            <Th>Пластинка</Th>
            <Th>Филиал</Th>
            <Th>Создана</Th>
            <Th>Дедлайн</Th>
            <Th>Осталось</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(booking => {
            const user = users.find(u => u.id === booking.userId);
            const record = allRecords.find(r => r.id === booking.recordId);
            const branch = branches.find(b => b.id === booking.branchId);
            const { text, colorClass } = getTimeUntil(booking.deadline);
            const isExpired = new Date(booking.deadline) < new Date();
            return (
              <Tr key={booking.id} className={isExpired ? "bg-red-900/5" : ""}>
                <Td><span className="font-data text-xs">#{booking.id}</span></Td>
                <Td>
                  <p className="text-xs font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </Td>
                <Td>
                  <button onClick={() => navigate("record", { id: record?.id })}
                    className="text-xs text-foreground hover:text-primary transition-colors">
                    {record?.title}
                  </button>
                </Td>
                <Td><span className="text-xs text-muted-foreground">{branch?.name}</span></Td>
                <Td><span className="text-xs font-data">{formatDateTime(booking.createdAt)}</span></Td>
                <Td><span className="text-xs font-data">{formatDateTime(booking.deadline)}</span></Td>
                <Td><span className={`text-xs font-data font-medium ${colorClass}`}>{text}</span></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Btn variant="outline" onClick={() => handleGive(booking.id)} className="text-xs py-1 px-2">
                      Выдать
                    </Btn>
                    <Btn variant="danger" onClick={() => handleExpire(booking.id)} className="text-xs py-1 px-2">
                      Снять
                    </Btn>
                  </div>
                </Td>
              </Tr>
            );
          })}
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">Активных броней нет</td></tr>
          )}
        </tbody>
      </TableWrap>
    </div>
  );
}
