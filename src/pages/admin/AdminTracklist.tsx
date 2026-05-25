import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, Modal, SelectInput, FormInput } from "../../components/ui";
import { nextId } from "../../utils/helpers";

export default function AdminTracklist() {
  const { params, navigate, records, tracks, setTracks, compositions, musicians } = useApp();
  const recordId = params.recordId;
  const record = records.find(r => r.id === recordId);
  const [addOpen, setAddOpen] = useState(false);
  const [compId, setCompId] = useState(String(compositions[0]?.id ?? ""));
  const [trackNum, setTrackNum] = useState("");

  const recordTracks = tracks.filter(t => t.recordId === recordId).sort((a, b) => a.trackNumber - b.trackNumber);

  function addTrack() {
    const newTrack = {
      id: nextId(tracks),
      recordId,
      trackNumber: Number(trackNum) || recordTracks.length + 1,
      compositionId: Number(compId),
    };
    setTracks(prev => [...prev, newTrack]);
    setAddOpen(false);
    setTrackNum("");
  }

  function removeTrack(id: number) {
    setTracks(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle
        title={`Треклист: ${record?.title ?? ""}`}
        action={<Btn variant="primary" onClick={() => { setCompId(String(compositions[0]?.id ?? "")); setTrackNum(String(recordTracks.length + 1)); setAddOpen(true); }}><Plus size={14} /> Добавить дорожку</Btn>}
      />
      <button onClick={() => navigate("record", { id: recordId })}
        className="text-xs text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-1">
        ← Вернуться к пластинке
      </button>

      <TableWrap>
        <thead>
          <tr>
            <Th className="w-12">№</Th>
            <Th>Произведение</Th>
            <Th>Композитор</Th>
            <Th>Длительность</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {recordTracks.map(track => {
            const comp = compositions.find(c => c.id === track.compositionId);
            const compositor = comp ? musicians.find(m => m.id === comp.compositorId) : null;
            return (
              <Tr key={track.id}>
                <Td><span className="font-data text-muted-foreground">{track.trackNumber}</span></Td>
                <Td><span className="text-sm font-medium">{comp?.title ?? "—"}</span></Td>
                <Td><span className="text-xs text-muted-foreground">{compositor ? `${compositor.firstName} ${compositor.lastName}` : "—"}</span></Td>
                <Td><span className="font-data text-xs text-muted-foreground">{comp?.duration ?? "—"}</span></Td>
                <Td>
                  <button onClick={() => removeTrack(track.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </Td>
              </Tr>
            );
          })}
          {recordTracks.length === 0 && (
            <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Треклист пуст</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить дорожку" size="sm">
        <div className="flex flex-col gap-4">
          <FormInput label="Номер дорожки" type="number" value={trackNum} onChange={setTrackNum} placeholder="1" />
          <SelectInput label="Произведение" value={compId} onChange={setCompId}
            options={compositions.map(c => ({ value: String(c.id), label: c.title }))} />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <Btn variant="ghost" onClick={() => setAddOpen(false)}>Отмена</Btn>
            <Btn variant="primary" onClick={addTrack}>Добавить</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
