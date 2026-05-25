import { useState } from "react";
import { Edit, Trash2, Plus, ShieldOff, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal, Badge } from "../../components/ui";
import { formatDate } from "../../utils/helpers";

export default function AdminManagers() {
  const { navigate, users, setUsers } = useApp();
  const managers = users.filter(u => u.role === "manager");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function toggleBlock(id: number) {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u
    ));
  }

  function confirmDelete() {
    if (deleteId !== null) {
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      setDeleteId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Менеджеры"
        action={
          <Btn variant="primary" onClick={() => navigate("admin-manager-form", { mode: "add" })}>
            <Plus size={14} /> Добавить менеджера
          </Btn>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Email</Th>
            <Th>Дата регистрации</Th>
            <Th>Статус</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {managers.map(manager => (
            <Tr key={manager.id}>
              <Td><span className="text-sm font-medium">{manager.firstName}</span></Td>
              <Td><span className="text-sm">{manager.lastName}</span></Td>
              <Td><span className="font-data text-xs text-muted-foreground">{manager.email}</span></Td>
              <Td><span className="font-data text-xs text-muted-foreground">{formatDate(manager.createdAt)}</span></Td>
              <Td>
                {manager.status === "active" ? (
                  <Badge variant="success">Активен</Badge>
                ) : (
                  <Badge variant="danger">Заблокирован</Badge>
                )}
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate("admin-manager-form", { mode: "edit", managerId: manager.id })}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    title="Редактировать"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => toggleBlock(manager.id)}
                    className={`p-1.5 transition-colors ${manager.status === "active" ? "text-muted-foreground hover:text-amber-400" : "text-muted-foreground hover:text-green-400"}`}
                    title={manager.status === "active" ? "Заблокировать" : "Разблокировать"}
                  >
                    {manager.status === "active" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                  </button>
                  <button
                    onClick={() => setDeleteId(manager.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
          {managers.length === 0 && (
            <tr>
              <td colSpan={6} className="py-12 text-center text-muted-foreground">Менеджеры не добавлены</td>
            </tr>
          )}
        </tbody>
      </TableWrap>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Удалить менеджера"
        message="Аккаунт менеджера будет удалён без возможности восстановления."
      />
    </div>
  );
}
