import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, TableWrap, Th, Td, Tr, StatusBadge, SelectInput, Pagination } from "../../components/ui";
import { formatDate, formatDateTime } from "../../utils/helpers";

const PER_PAGE = 15;

export default function ManagerBookingHistory() {
  const { bookings, records, users, branches } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [page, setPage] = useState(1);

  const historicalBookings = bookings.filter(b => b.status !== "active");

  const filtered = useMemo(() => {
    return historicalBookings.filter(b => {
      const user = users.find(u => u.id === b.userId);
      const record = records.find(r => r.id === b.recordId);
      const matchSearch = search === "" ||
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        String(b.id).includes(search) ||
        record?.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchBranch = branchFilter === "all" || b.branchId === Number(branchFilter);
      return matchSearch && matchStatus && matchBranch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [historicalBookings, users, records, search, statusFilter, branchFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="История броней" subtitle={`${filtered.length} записей`} />

      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-card border border-border">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск по имени, номеру брони или пластинке..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
        </div>
        <SelectInput value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }}
          options={[
            { value: "all", label: "Все статусы" },
            { value: "completed", label: "Завершённые" },
            { value: "cancelled", label: "Отменённые" },
            { value: "expired", label: "Просроченные" },
          ]} className="min-w-[180px]" />
        <SelectInput value={branchFilter} onChange={v => { setBranchFilter(v); setPage(1); }}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="min-w-[180px]" />
      </div>

      <TableWrap>
        <thead>
          <tr>
            <Th>№ брони</Th>
            <Th>Пользователь</Th>
            <Th>Пластинка</Th>
            <Th>Филиал</Th>
            <Th>Создана</Th>
            <Th>Завершена / отменена</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {paged.map(booking => {
            const user = users.find(u => u.id === booking.userId);
            const record = records.find(r => r.id === booking.recordId);
            const branch = branches.find(b => b.id === booking.branchId);
            return (
              <Tr key={booking.id}>
                <Td><span className="font-data text-xs">#{booking.id}</span></Td>
                <Td>
                  <p className="text-xs font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </Td>
                <Td><span className="text-xs">{record?.title}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{branch?.name}</span></Td>
                <Td><span className="text-xs font-data">{formatDate(booking.createdAt)}</span></Td>
                <Td><span className="text-xs font-data">{booking.completedAt ? formatDateTime(booking.completedAt) : "—"}</span></Td>
                <Td><StatusBadge status={booking.status} /></Td>
              </Tr>
            );
          })}
          {paged.length === 0 && (
            <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">История броней пуста</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
