import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";
import { PageTitle, SelectInput } from "../../components/ui";
import { formatPrice } from "../../utils/helpers";
import { MONTHLY_SALES_DATA } from "../../data/mockData";

export default function ManagerStatistics() {
  const { records, ensembles, branches } = useApp();
  const [period, setPeriod] = useState("current");
  const [branchFilter, setBranchFilter] = useState("all");
  const [ensembleFilter, setEnsembleFilter] = useState("all");

  const chartData = period === "current" ? MONTHLY_SALES_DATA : MONTHLY_SALES_DATA.map(d => ({ ...d, sales: Math.floor(d.sales * 0.78), revenue: Math.floor(d.revenue * 0.78) }));

  const tableRecords = records.filter(r => {
    return ensembleFilter === "all" || r.ensembleId === Number(ensembleFilter);
  });

  const totalSold = tableRecords.reduce((s, r) => s + r.soldCurrentYear, 0);
  const totalRevenue = tableRecords.reduce((s, r) => s + r.soldCurrentYear * r.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title="Статистика продаж" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <SelectInput value={period} onChange={setPeriod}
          options={[
            { value: "current", label: "Текущий год (2025)" },
            { value: "prev", label: "Прошлый год (2024)" },
          ]} className="min-w-[200px]" />
        <SelectInput value={branchFilter} onChange={setBranchFilter}
          options={[{ value: "all", label: "Все филиалы" }, ...branches.map(b => ({ value: String(b.id), label: b.name }))]}
          className="min-w-[180px]" />
        <SelectInput value={ensembleFilter} onChange={setEnsembleFilter}
          options={[{ value: "all", label: "Все ансамбли" }, ...ensembles.map(e => ({ value: String(e.id), label: e.name }))]}
          className="min-w-[220px]" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Всего продано", value: `${totalSold} шт.` },
          { label: "Выручка", value: formatPrice(totalRevenue) },
          { label: "Средняя цена", value: formatPrice(totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0) },
          { label: "Позиций в каталоге", value: String(tableRecords.length) },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{s.label}</p>
            <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border p-6 mb-8">
        <h3 className="font-display text-base font-semibold text-foreground mb-5">Продажи по месяцам</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
            <XAxis dataKey="month" tick={{ fill: "#7a7266", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7a7266", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#161616", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 0 }}
              labelStyle={{ color: "#e5ddd0", fontSize: 12 }}
              itemStyle={{ color: "#c9a84c" }}
            />
            <Bar dataKey="sales" fill="#c9a84c" radius={[2, 2, 0, 0]} name="Продано (шт.)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-4">Детализация по пластинкам</h3>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Пластинка</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ансамбль</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Продано</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Выручка</th>
              </tr>
            </thead>
            <tbody>
              {[...tableRecords].sort((a, b) => b.soldCurrentYear - a.soldCurrentYear).map(record => {
                const ensemble = ensembles.find(e => e.id === record.ensembleId);
                return (
                  <tr key={record.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-foreground text-xs">{record.title}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{ensemble?.name}</td>
                    <td className="px-4 py-3 text-right font-data text-xs font-medium">{record.soldCurrentYear}</td>
                    <td className="px-4 py-3 text-right text-primary text-xs font-medium">{formatPrice(record.soldCurrentYear * record.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
