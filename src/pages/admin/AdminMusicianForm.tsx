import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn, FormInput, FormTextarea } from "../../components/ui";
import axios from 'axios';

export default function AdminMusicianForm() {
  const { params, navigate } = useApp();
  const isEdit = params.mode === "edit";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");
  const [instruments, setInstruments] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if (birthDate) formData.append('birth_date', birthDate);
    formData.append('biography', biography);
    formData.append('instruments', instruments);
    if (photo) {
      formData.append('image', photo);
    }

    const url = isEdit && params.musicianId
      ? `http://127.0.0.1:8000/api/v1/musicians/${params.musicianId}/`
      : 'http://127.0.0.1:8000/api/v1/musicians/';

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
      navigate("admin-musicians");
    } catch (err: any) {
      console.error('Ошибка сохранения:', err);
      alert(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Ошибка сохранения');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать музыканта" : "Добавить музыканта"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <FormInput label="Имя" value={firstName} onChange={setFirstName} required />
            <FormInput label="Фамилия" value={lastName} onChange={setLastName} required />
          </div>
          <FormInput label="Дата рождения" type="date" value={birthDate} onChange={setBirthDate} />
          <FormTextarea label="Биография" value={biography} onChange={setBiography} rows={4} />
          <FormInput label="Инструменты (через запятую)" value={instruments} onChange={setInstruments} placeholder="Скрипка, фортепиано" />

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Фото музыканта
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:bg-primary file:text-primary-foreground file:border-0 file:text-xs hover:file:bg-primary/80 transition-colors"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Предпросмотр" className="w-24 h-24 object-cover rounded-full border border-border" />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("admin-musicians")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}