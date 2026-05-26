import { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { PageTitle, Btn } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { getRecords } from "../../services/records";
import api from "../../services/api";
import { RecordShort } from "../../types";

export default function ManagerOfflineSale() {
  const [records, setRecords] = useState<RecordShort[]>([]);
  const [query, setQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<RecordShort | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getRecords().then(setRecords);
  }, []);

  const suggestions = query.length >= 2
    ? records.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.catalogue_number.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  function selectRecord(record: RecordShort) {
    setSelectedRecord(record);
    setQuery(record.title);
    setConfirmed(false);
  }

  async function handleSell() {
    if (!selectedRecord) return;
    await api.post(`/records/${selectedRecord.id}/sell/`);
    setConfirmed(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Офлайн-продажа" subtitle="Зафиксировать продажу в торговом зале" />
      <div className="bg-card border border-border p-8">
        <div className="mb-6">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Поиск по названию или каталожному номеру
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={query}
              onChange={e => { setQuery(e.target.value); setSelectedRecord(null); setConfirmed(false); }}
              placeholder="Введите название или каталожный номер..."
              className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors" />
          </div>
          {suggestions.length > 0 && !selectedRecord && (
            <div className="mt-1 border border-border bg-card">
              {suggestions.map(record => (
                <button key={record.id} onClick={() => selectRecord(record)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-b border-border/40 last:border-0">
                  <div className="w-10 h-10 overflow-hidden flex-shrink-0 bg-secondary">
                    <img src={record.cover_image || ""} alt={record.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{record.title}</p>
                    <p className="text-xs text-muted-foreground">{record.ensemble_name} · {record.catalogue_number}</p>
                  </div>
                  <span className={`text-xs font-data ${record.stock_quantity === 0 ? "text-red-400" : "text-green-400"}`}>
                    {record.stock_quantity} шт.
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedRecord && !confirmed && (
          <div>
            <div className="flex items-center gap-5 p-5 bg-secondary border border-border mb-5">
              <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-card">
                <img src={selectedRecord.cover_image || ""} alt={selectedRecord.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">{selectedRecord.title}</h3>
                <p className="text-muted-foreground text-sm">{selectedRecord.ensemble_name}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedRecord.catalogue_number}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-primary font-medium text-lg">{formatPrice(Number(selectedRecord.retail_price))}</span>
                  <span className={`text-xs font-data ${selectedRecord.stock_quantity === 0 ? "text-red-400" : "text-green-400"}`}>
                    Остаток: {selectedRecord.stock_quantity} шт.
                  </span>
                </div>
              </div>
            </div>
            <Btn variant="primary" onClick={handleSell} disabled={selectedRecord.stock_quantity === 0} className="w-full justify-center py-3 text-base">
              {selectedRecord.stock_quantity === 0 ? "Нет в наличии" : "Продать"}
            </Btn>
          </div>
        )}
        {confirmed && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 bg-green-900/30 border border-green-900/50 flex items-center justify-center text-green-400">
              <Check size={28} />
            </div>
            <p className="font-display text-lg font-semibold text-foreground">Продажа зафиксирована</p>
            <Btn variant="outline" onClick={() => { setQuery(""); setSelectedRecord(null); setConfirmed(false); }} className="mt-2">
              Новая продажа
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}