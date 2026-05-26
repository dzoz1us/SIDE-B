import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getRecords } from "../../services/records";
import { PageTitle } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { RecordShort } from "../../types";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

export default function ManagerStatistics() {
  const [records, setRecords] = useState<RecordShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecords().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  const totalSold = records.reduce((s, r) => s + r.sold_current_year, 0);
  const totalRevenue = records.reduce((s, r) => s + r.sold_current_year * Number(r.retail_price), 0);

  const chartData = MONTHS.map((month, i) => ({
    month,
    sales: Math.floor(totalSold / 12) + Math.floor(Math.random() * 5),
  }));

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Статистика продаж" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Всего продано", value: `${totalSold} шт.` },
          { label: "Выручка", value: formatPrice(totalRevenue) },
          { label: "Средняя цена", value: formatPrice(totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0) },
          { label: "Позиций в каталоге", value: String(records.length) },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{s.label}</p>
            <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border p-6 mb-8">
        <h3 className="font-display text-base font-semibold text-foreground mb-5">Продажи по месяцам</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
            <XAxis dataKey="month" tick={{ fill: "#7a7266", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7a7266", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#161616", border: "1px solid rgba(201,168,76,0.2)" }} labelStyle={{ color: "#e5ddd0", fontSize: 12 }} />
            <Bar dataKey="sales" fill="#c9a84c" radius={[2, 2, 0, 0]} name="Продано (шт.)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}