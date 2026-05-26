import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getRecord } from "../../services/records";
import api from "../../services/api";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, Modal, SelectInput, FormInput } from "../../components/ui";
import { RecordDetail } from "../../types";
import axios from 'axios'

export default function AdminTracklist() {
  const { params, navigate } = useApp();
  const recordId = params.recordId;
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [compositions, setCompositions] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [compId, setCompId] = useState("");
  const [trackNum, setTrackNum] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRecord(recordId),
      api.get("/compositions/")
    ]).then(([recData, compRes]) => {
      setRecord(recData);
      setCompositions(compRes.data.results || compRes.data);
      setLoading(false);
    });
  }, [recordId]);

  async function addTrack() {
    const token = localStorage.getItem('access_token');
    await axios.post(`http://127.0.0.1:8000/api/v1/records/${recordId}/tracks/`, {
      composition: Number(compId),
      track_number: Number(trackNum),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = await getRecord(recordId);
    setRecord(updated);
    setAddOpen(false);
  }

  async function removeTrack(trackNumber: number) {
    await api.delete(`/tracks/${trackNumber}/`);
    const updated = await getRecord(recordId);
    setRecord(updated);
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={`Треклист: ${record?.title ?? ""}`}
        action={<Btn variant="primary" onClick={() => setAddOpen(true)}><Plus size={14} /> Добавить дорожку</Btn>} />
      <TableWrap>
        <thead>
          <tr>
            <Th>№</Th>
            <Th>Произведение</Th>
            <Th>Композитор</Th>
            <Th>Длительность</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {record?.tracks.map(track => (
            <Tr key={track.track_number}>
              <Td><span className="font-data text-muted-foreground">{track.track_number}</span></Td>
              <Td><span className="text-sm font-medium">{track.composition.title}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{track.composition.composer_name || "—"}</span></Td>
              <Td><span className="font-data text-xs text-muted-foreground">{Math.floor(track.composition.duration / 60)}:{String(track.composition.duration % 60).padStart(2, "0")}</span></Td>
              <Td><button onClick={() => removeTrack(track.track_number)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button></Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить дорожку" size="sm">
        <div className="flex flex-col gap-4">
          <FormInput label="Номер дорожки" type="number" value={trackNum} onChange={setTrackNum} />
          <SelectInput label="Произведение" value={compId} onChange={setCompId}
            options={compositions.map(c => ({ value: String(c.id), label: c.title }))} />
          <div className="flex gap-3 justify-end pt-2"><Btn variant="ghost" onClick={() => setAddOpen(false)}>Отмена</Btn><Btn variant="primary" onClick={addTrack}>Добавить</Btn></div>
        </div>
      </Modal>
    </div>
  );
}