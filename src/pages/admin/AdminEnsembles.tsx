import { useState } from "react";
import { Edit, Trash2, Plus, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal } from "../../components/ui";

export default function AdminEnsembles() {
  const { navigate, ensembles, setEnsembles, members } = useApp();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function deleteEnsemble() {
    if (deleteId !== null) {
      setEnsembles(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Управление ансамблями"
        action={<Btn variant="primary" onClick={() => navigate("admin-ensemble-form", { mode: "add" })}><Plus size={14} /> Добавить ансамбль</Btn>}
      />

      <TableWrap>
        <thead>
          <tr>
            <Th className="w-14">Фото</Th>
            <Th>Название</Th>
            <Th>Тип</Th>
            <Th>Год основания</Th>
            <Th>Страна</Th>
            <Th>Альбомов</Th>
            <Th>Участников</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {ensembles.map(ensemble => {
            const memberCount = members.filter(m => m.ensembleId === ensemble.id).length;
            return (
              <Tr key={ensemble.id}>
                <Td>
                  <div className="w-12 h-12 overflow-hidden bg-secondary">
                    <img src={ensemble.photo} alt={ensemble.name} className="w-full h-full object-cover" />
                  </div>
                </Td>
                <Td>
                  <button onClick={() => navigate("ensemble", { id: ensemble.id })}
                    className="font-medium text-foreground hover:text-primary transition-colors text-sm">
                    {ensemble.name}
                  </button>
                </Td>
                <Td><span className="text-xs text-muted-foreground">{ensemble.type}</span></Td>
                <Td><span className="text-xs font-data">{ensemble.founded}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{ensemble.country}</span></Td>
                <Td><span className="text-xs font-data">{ensemble.albumCount}</span></Td>
                <Td><span className="text-xs font-data">{memberCount}</span></Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate("admin-ensemble-members", { ensembleId: ensemble.id })}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Состав">
                      <Users size={14} />
                    </button>
                    <button onClick={() => navigate("admin-ensemble-form", { mode: "edit", ensembleId: ensemble.id })}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Редактировать">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => setDeleteId(ensemble.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors" title="Удалить">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </TableWrap>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteEnsemble}
        title="Удалить ансамбль"
        message="Внимание! Будет выполнено каскадное удаление: состав и все связанные пластинки будут удалены из каталога."
      />
    </div>
  );
}
