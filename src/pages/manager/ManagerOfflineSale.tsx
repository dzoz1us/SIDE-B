import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PageTitle, Btn } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";

export default function ManagerOfflineSale() {
  const { records, setRecords, ensembles, recordBranches } = useApp();
  const [query, setQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<typeof records[0] | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];
    return records.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.catalogNumber.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  }, [records, query]);

  const totalStock = selectedRecord
    ? recordBranches.filter(rb => rb.recordId === selectedRecord.id).reduce((s, rb) => s + rb.quantity, 0)
    : 0;

  function selectRecord(record: typeof records[0]) {
    setSelectedRecord(record);
    setQuery(record.title);
    setConfirmed(false);
  }

  function handleSell() {
    if (!selectedRecord || totalStock === 0) return;
    setRecords(prev => prev.map(r =>
      r.id === selectedRecord.id
        ? { ...r, soldCurrentYear: r.soldCurrentYear + 1 }
        : r
    ));
    setConfirmed(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Офлайн-продажа" subtitle="Зафиксировать продажу в торговом зале" />

      <div className="bg-card border border-border p-8">
        {/* Search */}
        <div className="mb-6">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Поиск по названию или каталожному номеру
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedRecord(null); setConfirmed(false); }}
              placeholder="Введите название или каталожный номер..."
              className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !selectedRecord && (
            <div className="mt-1 border border-border bg-card">
              {suggestions.map(record => {
                const ensemble = ensembles.find(e => e.id === record.ensembleId);
                const stock = recordBranches.filter(rb => rb.recordId === record.id).reduce((s, rb) => s + rb.quantity, 0);
                return (
                  <button key={record.id} onClick={() => selectRecord(record)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-b border-border/40 last:border-0">
                    <div className="w-10 h-10 overflow-hidden flex-shrink-0 bg-secondary">
                      <img src={record.cover} alt={record.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{record.title}</p>
                      <p className="text-xs text-muted-foreground">{ensemble?.name} · {record.catalogNumber}</p>
                    </div>
                    <span className={`text-xs font-data ${stock === 0 ? "text-red-400" : "text-green-400"}`}>
                      {stock} шт.
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected record info */}
        {selectedRecord && !confirmed && (
          <div>
            <div className="flex items-center gap-5 p-5 bg-secondary border border-border mb-5">
              <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-card">
                <img src={selectedRecord.cover} alt={selectedRecord.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">{selectedRecord.title}</h3>
                <p className="text-muted-foreground text-sm">{ensembles.find(e => e.id === selectedRecord.ensembleId)?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedRecord.catalogNumber}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-primary font-medium text-lg">{formatPrice(selectedRecord.price)}</span>
                  <span className={`text-xs font-data ${totalStock === 0 ? "text-red-400" : "text-green-400"}`}>
                    Остаток: {totalStock} шт.
                  </span>
                </div>
              </div>
            </div>

            <Btn
              variant="primary"
              onClick={handleSell}
              disabled={totalStock === 0}
              className="w-full justify-center py-3 text-base"
            >
              {totalStock === 0 ? "Нет в наличии" : "Продать"}
            </Btn>
          </div>
        )}

        {/* Confirmation */}
        {confirmed && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 bg-green-900/30 border border-green-900/50 flex items-center justify-center text-green-400">
              <Check size={28} />
            </div>
            <p className="font-display text-lg font-semibold text-foreground">Продажа зафиксирована</p>
            <p className="text-muted-foreground text-sm text-center">
              Чек не предусмотрен системой.<br />
              Продажа учтена в статистике.
            </p>
            <Btn variant="outline" onClick={() => { setQuery(""); setSelectedRecord(null); setConfirmed(false); }} className="mt-2">
              Новая продажа
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
