import { useState } from "react";
import { Edit, Trash2, Plus, Check, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal, Modal, FormInput, SelectInput } from "../../components/ui";
import { nextId } from "../../utils/helpers";

export default function AdminCompositions() {
  const { compositions, setCompositions, musicians } = useApp();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<number | null>(null);
  const [addModal, setAddModal] = useState(false);

  const [title, setTitle] = useState("");
  const [compositorId, setCompositorId] = useState(String(musicians[0]?.id ?? ""));
  const [duration, setDuration] = useState("");

  function openAdd() {
    setTitle(""); setCompositorId(String(musicians[0]?.id ?? "")); setDuration("");
    setAddModal(true);
  }

  function openEdit(id: number) {
    const comp = compositions.find(c => c.id === id)!;
    setTitle(comp.title); setCompositorId(String(comp.compositorId)); setDuration(comp.duration);
    setEditModal(id);
  }

  function saveAdd() {
    setCompositions(prev => [...prev, { id: nextId(prev), title, compositorId: Number(compositorId), duration }]);
    setAddModal(false);
  }

  function saveEdit() {
    setCompositions(prev => prev.map(c => c.id === editModal
      ? { ...c, title, compositorId: Number(compositorId), duration }
      : c));
    setEditModal(null);
  }

  const FormContent = (
    <div className="flex flex-col gap-4">
      <FormInput label="Название произведения" value={title} onChange={setTitle} placeholder="Название..." required />
      <SelectInput label="Композитор" value={compositorId} onChange={setCompositorId}
        options={musicians.map(m => ({ value: String(m.id), label: `${m.firstName} ${m.lastName}` }))} />
      <FormInput label="Длительность" value={duration} onChange={setDuration} placeholder="5:30" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title="Музыкальные произведения"
        action={<Btn variant="primary" onClick={openAdd}><Plus size={14} /> Добавить произведение</Btn>}
      />

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
          {compositions.map(comp => {
            const musician = musicians.find(m => m.id === comp.compositorId);
            return (
              <Tr key={comp.id}>
                <Td><span className="text-sm font-medium">{comp.title}</span></Td>
                <Td><span className="text-sm text-muted-foreground">{musician ? `${musician.firstName} ${musician.lastName}` : "—"}</span></Td>
                <Td><span className="font-data text-xs text-muted-foreground">{comp.duration}</span></Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(comp.id)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => setDeleteId(comp.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </TableWrap>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Добавить произведение" size="sm">
        {FormContent}
        <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-border">
          <Btn variant="ghost" onClick={() => setAddModal(false)}>Отмена</Btn>
          <Btn variant="primary" onClick={saveAdd}>Сохранить</Btn>
        </div>
      </Modal>

      <Modal open={editModal !== null} onClose={() => setEditModal(null)} title="Редактировать произведение" size="sm">
        {FormContent}
        <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-border">
          <Btn variant="ghost" onClick={() => setEditModal(null)}>Отмена</Btn>
          <Btn variant="primary" onClick={saveEdit}>Сохранить</Btn>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { setCompositions(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }}
        title="Удалить произведение"
        message="Произведение будет удалено из базы данных и из всех треклистов."
      />
    </div>
  );
}
