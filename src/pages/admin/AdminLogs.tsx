import { useState, useEffect } from "react";
import api from "../../services/api";
import { PageTitle, TableWrap, Th, Td, Tr, Pagination } from "../../components/ui";
import { formatDateTime } from "../../utils/helpers";

const PAGE_SIZE = 20;

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/auth/logs/").then(res => {
      setLogs(res.data.results || res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const paged = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Журнал действий" subtitle={`${logs.length} записей`} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Дата и время</Th>
            <Th>Пользователь</Th>
            <Th>Действие</Th>
            <Th>Объект</Th>
            <Th>Детали</Th>
          </tr>
        </thead>
        <tbody>
          {paged.map(log => (
            <Tr key={log.id}>
              <Td><span className="font-data text-xs text-muted-foreground">{formatDateTime(log.created_at)}</span></Td>
              <Td><span className="text-xs font-medium">{log.user_name || log.user_email}</span></Td>
              <Td><span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5">{log.action}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{log.object_type}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{log.details}</span></Td>
            </Tr>
          ))}
          {paged.length === 0 && (
            <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Логи пусты</td></tr>
          )}
        </tbody>
      </TableWrap>
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}