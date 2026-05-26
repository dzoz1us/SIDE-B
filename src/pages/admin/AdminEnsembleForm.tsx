import { useState } from "react";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";
import { PageTitle, Btn, FormInput, SelectInput, FormTextarea } from "../../components/ui";
import axios from 'axios';

const TYPES = ["Квартет", "Джаз-банд", "Рок-группа", "Оркестр", "Камерный оркестр", "Трио", "Дуэт", "Ансамбль"];

export default function AdminEnsembleForm() {
  const { params, navigate } = useApp();
  const isEdit = params.mode === "edit";
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [founded, setFounded] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    if (founded) formData.append('founded', founded);
    formData.append('country', country);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    const url = isEdit && params.ensembleId
      ? `http://127.0.0.1:8000/api/v1/ensembles/${params.ensembleId}/`
      : 'http://127.0.0.1:8000/api/v1/ensembles/';

    try {
      if (isEdit) {
        await axios.patch(url, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("admin-ensembles");
    } catch (err: any) {
      console.error('Ошибка сохранения:', err);
      alert(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Ошибка сохранения');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать ансамбль" : "Добавить ансамбль"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <FormInput label="Название" value={name} onChange={setName} placeholder="Название ансамбля" required />
          <div className="grid grid-cols-2 gap-5">
            <SelectInput label="Тип" value={type} onChange={setType} options={TYPES.map(t => ({ value: t, label: t }))} />
            <FormInput label="Год основания" type="number" value={founded} onChange={setFounded} placeholder="1946" required />
          </div>
          <FormInput label="Страна" value={country} onChange={setCountry} placeholder="Россия" required />
          <FormTextarea label="Описание" value={description} onChange={setDescription} rows={2} />

          {/* Загрузка картинки */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Фото ансамбля
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:bg-primary file:text-primary-foreground file:border-0 file:text-xs hover:file:bg-primary/80 transition-colors"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Предпросмотр" className="w-40 h-24 object-cover border border-border" />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-ensembles")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}