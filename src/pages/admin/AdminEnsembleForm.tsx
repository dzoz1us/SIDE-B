import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, FormInput, FormTextarea, SelectInput } from "../../components/ui";
import { nextId } from "../../utils/helpers";

const TYPES = ["Квартет", "Джаз-банд", "Рок-группа", "Оркестр", "Камерный оркестр", "Трио", "Дуэт", "Ансамбль"];

export default function AdminEnsembleForm() {
  const { params, navigate, ensembles, setEnsembles } = useApp();
  const isEdit = params.mode === "edit";
  const existing = isEdit ? ensembles.find(e => e.id === params.ensembleId) : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? TYPES[0]);
  const [founded, setFounded] = useState(String(existing?.founded ?? ""));
  const [country, setCountry] = useState(existing?.country ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [photo, setPhoto] = useState(existing?.photo ?? "");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name, type, founded: Number(founded), country, description, bio, photo,
      albumCount: existing?.albumCount ?? 0,
      memberCount: existing?.memberCount ?? 0,
    };
    if (isEdit && existing) {
      setEnsembles(prev => prev.map(e => e.id === existing.id ? { ...e, ...data } : e));
    } else {
      setEnsembles(prev => [...prev, { id: nextId(prev), ...data }]);
    }
    navigate("admin-ensembles");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать ансамбль" : "Добавить ансамбль"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <FormInput label="Название" value={name} onChange={setName} placeholder="Название ансамбля" required />
          <div className="grid grid-cols-2 gap-5">
            <SelectInput label="Тип" value={type} onChange={setType}
              options={TYPES.map(t => ({ value: t, label: t }))} />
            <FormInput label="Год основания" type="number" value={founded} onChange={setFounded} placeholder="1946" required />
          </div>
          <FormInput label="Страна" value={country} onChange={setCountry} placeholder="Россия" required />
          <FormTextarea label="Краткое описание" value={description} onChange={setDescription} rows={2} placeholder="Краткое описание..." />
          <FormTextarea label="Биография" value={bio} onChange={setBio} rows={4} placeholder="Подробная биография..." />
          <FormInput label="URL фотографии" value={photo} onChange={setPhoto} placeholder="https://..." />
          {photo && (
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 overflow-hidden bg-secondary border border-border">
                <img src={photo} alt="Фото" className="w-full h-full object-cover" />
              </div>
              <p className="text-muted-foreground text-xs">Предпросмотр</p>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-ensembles")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
