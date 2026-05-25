import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal, Badge } from "../../components/ui";
import { formatDate } from "../../utils/helpers";

export default function AdminMusicians() {
  const { navigate, musicians, setMusicians } = useApp();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function deleteMusician() {
    if (deleteId !== null) {
      setMusicians(prev => prev.filter(m => m.id !== deleteId));
      setDeleteId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Управление музыкантами"
        action={<Btn variant="primary" onClick={() => navigate("admin-musician-form", { mode: "add" })}><Plus size={14} /> Добавить музыканта</Btn>}
      />

      <TableWrap>
        <thead>
          <tr>
            <Th className="w-14">Фото</Th>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Дата рождения</Th>
            <Th>Инструменты</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {musicians.map(musician => (
            <Tr key={musician.id}>
              <Td>
                <div className="w-10 h-10 overflow-hidden bg-secondary rounded-full">
                  <img src={musician.photo} alt={`${musician.firstName} ${musician.lastName}`}
                    className="w-full h-full object-cover" />
                </div>
              </Td>
              <Td>
                <button onClick={() => navigate("musician", { id: musician.id })}
                  className="text-foreground hover:text-primary transition-colors text-sm font-medium">
                  {musician.firstName}
                </button>
              </Td>
              <Td><span className="text-sm">{musician.lastName}</span></Td>
              <Td><span className="text-xs font-data text-muted-foreground">{formatDate(musician.birthDate)}</span></Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {musician.instruments.map(inst => (
                    <Badge key={inst} variant="gold">{inst}</Badge>
                  ))}
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate("admin-musician-form", { mode: "edit", musicianId: musician.id })}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => setDeleteId(musician.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteMusician}
        title="Удалить музыканта"
        message="Музыкант будет удалён из базы данных и из состава всех ансамблей."
      />
    </div>
  );
}
