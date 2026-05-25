import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, Modal, SelectInput, FormInput } from "../../components/ui";
import { nextId } from "../../utils/helpers";

const ROLES = ["Исполнитель", "Дирижёр", "Руководитель", "Солист"];

export default function AdminEnsembleMembers() {
  const { params, navigate, ensembles, musicians, members, setMembers } = useApp();
  const ensembleId = params.ensembleId;
  const ensemble = ensembles.find(e => e.id === ensembleId);
  const [addOpen, setAddOpen] = useState(false);
  const [musicianId, setMusicianId] = useState(String(musicians[0]?.id ?? ""));
  const [role, setRole] = useState(ROLES[0]);
  const [instrument, setInstrument] = useState("");
  const [from, setFrom] = useState(String(new Date().getFullYear()));

  const ensembleMembers = members.filter(m => m.ensembleId === ensembleId);

  function removeMember(memberId: number) {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  }

  function addMember() {
    const newMember = {
      id: nextId(members),
      ensembleId,
      musicianId: Number(musicianId),
      role, instrument,
      from: Number(from),
    };
    setMembers(prev => [...prev, newMember]);
    setAddOpen(false);
    setInstrument("");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title={`Состав ансамбля: ${ensemble?.name ?? ""}`}
        action={<Btn variant="primary" onClick={() => setAddOpen(true)}><Plus size={14} /> Добавить участника</Btn>}
      />
      <button onClick={() => navigate("admin-ensembles")}
        className="text-xs text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-1">
        ← Вернуться к ансамблям
      </button>

      <TableWrap>
        <thead>
          <tr>
            <Th>Фото</Th>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Роль</Th>
            <Th>Инструмент</Th>
            <Th>С года</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {ensembleMembers.map(member => {
            const musician = musicians.find(m => m.id === member.musicianId);
            if (!musician) return null;
            return (
              <Tr key={member.id}>
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
                <Td><span className="text-xs text-muted-foreground">{member.role}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{member.instrument || "—"}</span></Td>
                <Td><span className="text-xs font-data">{member.from}</span></Td>
                <Td>
                  <button onClick={() => removeMember(member.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </Td>
              </Tr>
            );
          })}
          {ensembleMembers.length === 0 && (
            <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Состав пуст</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить участника" size="sm">
        <div className="flex flex-col gap-4">
          <SelectInput label="Музыкант" value={musicianId} onChange={setMusicianId}
            options={musicians.map(m => ({ value: String(m.id), label: `${m.firstName} ${m.lastName}` }))} />
          <SelectInput label="Роль" value={role} onChange={setRole}
            options={ROLES.map(r => ({ value: r, label: r }))} />
          <FormInput label="Инструмент (необязательно)" value={instrument} onChange={setInstrument} placeholder="Скрипка, фортепиано..." />
          <FormInput label="Год вступления" type="number" value={from} onChange={setFrom} placeholder="2003" />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <Btn variant="ghost" onClick={() => setAddOpen(false)}>Отмена</Btn>
            <Btn variant="primary" onClick={addMember}>Добавить</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
