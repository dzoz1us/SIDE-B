import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Users } from "lucide-react";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal } from "../../components/ui";
import { getEnsembles } from "../../services/ensembles";
import api from "../../services/api";
import { EnsembleShort } from "../../types";
import { useApp } from "../../context/AppContext";

export default function AdminEnsembles() {
  const { navigate } = useApp();
  const [ensembles, setEnsembles] = useState<EnsembleShort[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnsembles().then(data => {
      setEnsembles(data);
      setLoading(false);
    });
  }, []);

  async function deleteEnsemble() {
    if (deleteId !== null) {
      await api.delete(`/ensembles/${deleteId}/`);
      setEnsembles(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Управление ансамблями"
        action={<Btn variant="primary" onClick={() => navigate("admin-ensemble-form", { mode: "add" })}><Plus size={14} /> Добавить ансамбль</Btn>} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Название</Th>
            <Th>Тип</Th>
            <Th>Год основания</Th>
            <Th>Страна</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {ensembles.map(ensemble => (
            <Tr key={ensemble.id}>
              <Td><button onClick={() => navigate("ensemble", { id: ensemble.id })} className="font-medium text-foreground hover:text-primary transition-colors text-sm">{ensemble.name}</button></Td>
              <Td><span className="text-xs text-muted-foreground">{ensemble.type}</span></Td>
              <Td><span className="text-xs font-data">{ensemble.founded}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{ensemble.country}</span></Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate("admin-ensemble-members", { ensembleId: ensemble.id })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Users size={14} /></button>
                  <button onClick={() => navigate("admin-ensemble-form", { mode: "edit", ensembleId: ensemble.id })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
                  <button onClick={() => setDeleteId(ensemble.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <ConfirmModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={deleteEnsemble}
        title="Удалить ансамбль" message="Будет выполнено каскадное удаление состава и пластинок." />
    </div>
  );
}