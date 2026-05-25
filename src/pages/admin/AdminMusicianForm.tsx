import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, FormInput, FormTextarea } from "../../components/ui";
import { nextId } from "../../utils/helpers";

export default function AdminMusicianForm() {
  const { params, navigate, musicians, setMusicians } = useApp();
  const isEdit = params.mode === "edit";
  const existing = isEdit ? musicians.find(m => m.id === params.musicianId) : null;

  const [firstName, setFirstName] = useState(existing?.firstName ?? "");
  const [lastName, setLastName] = useState(existing?.lastName ?? "");
  const [birthDate, setBirthDate] = useState(existing?.birthDate ?? "");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [photo, setPhoto] = useState(existing?.photo ?? "");
  const [instruments, setInstruments] = useState<string[]>(existing?.instruments ?? []);
  const [newInst, setNewInst] = useState("");

  function addInstrument() {
    if (newInst.trim() && !instruments.includes(newInst.trim())) {
      setInstruments(prev => [...prev, newInst.trim()]);
      setNewInst("");
    }
  }

  function removeInstrument(inst: string) {
    setInstruments(prev => prev.filter(i => i !== inst));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data = { firstName, lastName, birthDate, bio, photo, instruments };
    if (isEdit && existing) {
      setMusicians(prev => prev.map(m => m.id === existing.id ? { ...m, ...data } : m));
    } else {
      setMusicians(prev => [...prev, { id: nextId(prev), ...data }]);
    }
    navigate("admin-musicians");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать музыканта" : "Добавить музыканта"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <FormInput label="Имя" value={firstName} onChange={setFirstName} placeholder="Имя" required />
            <FormInput label="Фамилия" value={lastName} onChange={setLastName} placeholder="Фамилия" required />
          </div>
          <FormInput label="Дата рождения" type="date" value={birthDate} onChange={setBirthDate} required />
          <FormTextarea label="Биография" value={bio} onChange={setBio} rows={4} placeholder="Биография музыканта..." />

          {/* Instruments */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Инструменты</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {instruments.map(inst => (
                <span key={inst} className="inline-flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/30 px-2 py-1 text-xs">
                  {inst}
                  <button type="button" onClick={() => removeInstrument(inst)} className="hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newInst} onChange={e => setNewInst(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addInstrument(); } }}
                placeholder="Добавить инструмент..."
                className="flex-1 bg-secondary border border-border text-foreground placeholder-muted-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
              <Btn type="button" variant="secondary" onClick={addInstrument}><Plus size={14} /></Btn>
            </div>
          </div>

          <FormInput label="URL фотографии" value={photo} onChange={setPhoto} placeholder="https://..." />
          {photo && (
            <div className="w-20 h-20 overflow-hidden bg-secondary border border-border rounded-full">
              <img src={photo} alt="Фото" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-musicians")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
