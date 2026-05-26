import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, ShieldOff, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";
import { PageTitle, Btn, TableWrap, Th, Td, Tr, ConfirmModal, Badge } from "../../components/ui";
import axios from 'axios';

export default function AdminManagers() {
  const { navigate } = useApp();
  const [managers, setManagers] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function loadManagers() {
    api.get("/auth/managers/").then(res => {
      setManagers(res.data.results || res.data);
      setLoading(false);
    });
  }

  useEffect(() => { loadManagers(); }, []);

  async function toggleBlock(id: number) {
    await api.post(`/auth/managers/${id}/toggle-block/`);
    loadManagers();
  }

  async function deleteManager() {
    if (deleteId !== null) {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/v1/auth/managers/${deleteId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(prev => prev.filter(m => m.id !== deleteId));
      setDeleteId(null);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Менеджеры"
        action={<Btn variant="primary" onClick={() => navigate("admin-manager-form", { mode: "add" })}><Plus size={14} /> Добавить</Btn>} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Имя</Th>
            <Th>Email</Th>
            <Th>Статус</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {managers.map(m => (
            <Tr key={m.id}>
              <Td><span className="text-sm font-medium">{m.first_name} {m.last_name}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{m.email}</span></Td>
              <Td><Badge variant={m.is_active ? "success" : "danger"}>{m.is_active ? "Активен" : "Заблокирован"}</Badge></Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate("admin-manager-form", { mode: "edit", managerId: m.id })}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
                  <button onClick={() => toggleBlock(m.id)}
                    className={`p-1.5 transition-colors ${m.is_active ? "text-muted-foreground hover:text-amber-400" : "text-muted-foreground hover:text-green-400"}`}>
                    {m.is_active ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                  </button>
                  <button onClick={() => setDeleteId(m.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      <ConfirmModal open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={deleteManager}
        title="Удалить менеджера" message="Аккаунт будет удалён." />
    </div>
  );
}