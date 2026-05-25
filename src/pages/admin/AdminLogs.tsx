import { useState, useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, TableWrap, Th, Td, Tr, Pagination } from "../../components/ui";
import { formatDateTime } from "../../utils/helpers";

const PAGE_SIZE = 20;

export default function AdminLogs() {
  const { actionLogs, users } = useApp();
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const managerUsers = users.filter(u => u.role === "manager" || u.role === "admin");

  const filtered = useMemo(() => {
    let result = [...actionLogs].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (filterUser) result = result.filter(l => String(l.userId) === filterUser);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.object.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return result;
  }, [actionLogs, search, filterUser]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function reset() {
    setSearch("");
    setFilterUser("");
    setCurrentPage(1);
  }

  function getUserName(userId: number) {
    const u = users.find(u => u.id === userId);
    return u ? `${u.firstName} ${u.lastName}` : `Пользователь #${userId}`;
  }

  const hasFilters = search || filterUser;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Журнал действий" />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Поиск по действию, объекту, деталям..."
            className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <select
          value={filterUser}
          onChange={e => { setFilterUser(e.target.value); setCurrentPage(1); }}
          className="bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors min-w-48"
        >
          <option value="">Все пользователи</option>
          {managerUsers.map(u => (
            <option key={u.id} value={String(u.id)}>{u.firstName} {u.lastName}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary/40 transition-colors"
          >
            <RotateCcw size={12} /> Сбросить
          </button>
        )}
      </div>

      <div className="text-xs text-muted-foreground mb-4">
        Найдено записей: <span className="font-data text-foreground">{filtered.length}</span>
      </div>

      <TableWrap>
        <thead>
          <tr>
            <Th className="w-44">Дата и время</Th>
            <Th>Пользователь</Th>
            <Th>Действие</Th>
            <Th>Объект</Th>
            <Th>Детали</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(log => (
            <Tr key={log.id}>
              <Td><span className="font-data text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</span></Td>
              <Td><span className="text-xs font-medium">{getUserName(log.userId)}</span></Td>
              <Td>
                <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5">
                  {log.action}
                </span>
              </Td>
              <Td><span className="text-xs text-muted-foreground">{log.object}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{log.details}</span></Td>
            </Tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-muted-foreground">Записи не найдены</td>
            </tr>
          )}
        </tbody>
      </TableWrap>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={currentPage} totalPages={totalPages} onPage={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
