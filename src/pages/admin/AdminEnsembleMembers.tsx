import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getEnsemble } from "../../services/ensembles";
import api from "../../services/api";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, Modal, SelectInput, FormInput } from "../../components/ui";
import { EnsembleDetail } from "../../types";
import axios from 'axios';

const ROLES = ["исполнитель", "дирижёр", "руководитель"];

export default function AdminEnsembleMembers() {
  const { params, navigate } = useApp();
  const ensembleId = params.ensembleId;
  const [ensemble, setEnsemble] = useState<EnsembleDetail | null>(null);
  const [musicians, setMusicians] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [musicianId, setMusicianId] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [instrument, setInstrument] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnsemble(ensembleId),
      api.get("/musicians/")
    ]).then(([ensData, musRes]) => {
      setEnsemble(ensData);
      setMusicians(musRes.data.results || musRes.data);
      setLoading(false);
    });
  }, [ensembleId]);

  async function addMember() {
    await api.post("/participations/", {
      musician: Number(musicianId),
      ensemble: ensembleId,
      role,
      instrument,
    });
    const updated = await getEnsemble(ensembleId);
    setEnsemble(updated);
    setAddOpen(false);
  }

  async function removeMember(participationId: number) {
    const token = localStorage.getItem('access_token');
    await axios.delete(`http://127.0.0.1:8000/api/v1/participations/${participationId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = await getEnsemble(ensembleId);
    setEnsemble(updated);
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={`Состав: ${ensemble?.name ?? ""}`}
        action={<Btn variant="primary" onClick={() => setAddOpen(true)}><Plus size={14} /> Добавить участника</Btn>} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Имя</Th>
            <Th>Роль</Th>
            <Th>Инструмент</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {ensemble?.members.map(member => (
            <Tr key={member.musician_id}>
              <Td><span className="text-sm font-medium">{member.first_name} {member.last_name}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{member.role}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{member.instrument || "—"}</span></Td>
              <Td><button onClick={() => removeMember(member.musician_id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button></Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить участника" size="sm">
        <div className="flex flex-col gap-4">
          <SelectInput label="Музыкант" value={musicianId} onChange={setMusicianId}
            options={musicians.map(m => ({ value: String(m.id), label: `${m.first_name} ${m.last_name}` }))} />
          <SelectInput label="Роль" value={role} onChange={setRole} options={ROLES.map(r => ({ value: r, label: r }))} />
          <FormInput label="Инструмент" value={instrument} onChange={setInstrument} placeholder="Скрипка" />
          <div className="flex gap-3 justify-end pt-2"><Btn variant="ghost" onClick={() => setAddOpen(false)}>Отмена</Btn><Btn variant="primary" onClick={addMember}>Добавить</Btn></div>
        </div>
      </Modal>
    </div>
  );
}