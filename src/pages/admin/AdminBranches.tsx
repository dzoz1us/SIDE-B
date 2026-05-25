import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal } from "../../components/ui";

export default function AdminBranches() {
  const { navigate, branches, setBranches, bookings } = useApp();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function confirmDelete() {
    if (deleteId !== null) {
      setBranches(prev => prev.filter(b => b.id !== deleteId));
      setDeleteId(null);
    }
  }

  const activeBookingsForBranch = (branchId: number) =>
    bookings.filter(b => b.branchId === branchId && b.status === "active").length;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Филиалы"
        action={
          <Btn variant="primary" onClick={() => navigate("admin-branch-form", { mode: "add" })}>
            <Plus size={14} /> Добавить филиал
          </Btn>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Название</Th>
            <Th>Адрес</Th>
            <Th>Телефон</Th>
            <Th>Часы работы</Th>
            <Th>Активные брони</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => {
            const activeCount = activeBookingsForBranch(branch.id);
            return (
              <Tr key={branch.id}>
                <Td><span className="text-sm font-medium">{branch.name}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{branch.address}</span></Td>
                <Td><span className="font-data text-xs text-muted-foreground">{branch.phone}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{branch.hours}</span></Td>
                <Td>
                  {activeCount > 0 ? (
                    <span className="font-data text-xs text-amber-400">{activeCount}</span>
                  ) : (
                    <span className="font-data text-xs text-muted-foreground">0</span>
                  )}
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate("admin-branch-form", { mode: "edit", branchId: branch.id })}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(branch.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
          {branches.length === 0 && (
            <tr>
              <td colSpan={6} className="py-12 text-center text-muted-foreground">Филиалы не добавлены</td>
            </tr>
          )}
        </tbody>
      </TableWrap>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Удалить филиал"
        message="Филиал будет удалён из базы данных. Все связанные записи о бронировании и остатках будут затронуты."
      />
    </div>
  );
}
