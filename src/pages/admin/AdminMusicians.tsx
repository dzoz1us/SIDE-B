import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import axios from 'axios';

export default function AdminMusicians() {
  const { navigate } = useApp();
  const [musicians, setMusicians] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/musicians/").then(res => {
      setMusicians(res.data.results || res.data);
      setLoading(false);
    });
  }, []);

  async function deleteMusician() {
  if (deleteId !== null) {
    const token = localStorage.getItem('access_token');
    await axios.delete(`http://127.0.0.1:8000/api/v1/musicians/${deleteId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMusicians(prev => prev.filter(m => m.id !== deleteId));
    setDeleteId(null);
  }
}

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Управление музыкантами"
        action={<Btn variant="primary" onClick={() => navigate("admin-musician-form", { mode: "add" })}><Plus size={14} /> Добавить</Btn>} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Инструменты</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {musicians.map(m => (
            <Tr key={m.id}>
              <Td><span className="text-sm font-medium">{m.first_name}</span></Td>
              <Td><span className="text-sm">{m.last_name}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{m.instruments}</span></Td>
              <Td>
                <button onClick={() => navigate("admin-musician-form", { mode: "edit", musicianId: m.id })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
                <button onClick={() => setDeleteId(m.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <ConfirmModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={deleteMusician}
        title="Удалить музыканта" message="Музыкант будет удалён." />
    </div>
  );
}