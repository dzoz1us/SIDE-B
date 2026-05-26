import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal, Modal, FormInput, SelectInput } from "../../components/ui";

export default function AdminCompositions() {
  const [compositions, setCompositions] = useState<any[]>([]);
  const [musicians, setMusicians] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [composerId, setComposerId] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/compositions/"),
      api.get("/musicians/")
    ]).then(([compRes, musRes]) => {
      setCompositions(compRes.data.results || compRes.data);
      setMusicians(musRes.data.results || musRes.data);
      setLoading(false);
    });
  }, []);

  async function saveAdd() {
    await api.post("/compositions/", { title, composer: Number(composerId), duration: Number(duration) });
    const res = await api.get("/compositions/");
    setCompositions(res.data.results || res.data);
    setAddModal(false);
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Музыкальные произведения"
        action={<Btn variant="primary" onClick={() => setAddModal(true)}><Plus size={14} /> Добавить произведение</Btn>} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Название</Th>
            <Th>Композитор</Th>
            <Th>Длительность</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {compositions.map(comp => (
            <Tr key={comp.id}>
              <Td><span className="text-sm font-medium">{comp.title}</span></Td>
              <Td><span className="text-sm text-muted-foreground">{comp.composer_name || "—"}</span></Td>
              <Td><span className="font-data text-xs text-muted-foreground">{comp.duration} сек.</span></Td>
              <Td>
                <button onClick={() => setDeleteId(comp.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Добавить произведение" size="sm">
        <div className="flex flex-col gap-4">
          <FormInput label="Название" value={title} onChange={setTitle} required />
          <SelectInput label="Композитор" value={composerId} onChange={setComposerId}
            options={musicians.map(m => ({ value: String(m.id), label: `${m.first_name} ${m.last_name}` }))} />
          <FormInput label="Длительность (сек.)" type="number" value={duration} onChange={setDuration} />
          <div className="flex gap-3 justify-end pt-2"><Btn variant="ghost" onClick={() => setAddModal(false)}>Отмена</Btn><Btn variant="primary" onClick={saveAdd}>Сохранить</Btn></div>
        </div>
      </Modal>
      <ConfirmModal open={deleteId !== null} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await api.delete(`/compositions/${deleteId}/`); setCompositions(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }}
        title="Удалить произведение" message="Произведение будет удалено." />
    </div>
  );
}