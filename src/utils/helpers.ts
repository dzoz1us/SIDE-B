export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

export function getTimeUntil(deadline: string): { text: string; colorClass: string } {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { text: "Просрочено", colorClass: "text-red-400" };
  const hours = diff / 3600000;
  if (hours < 1) return { text: `${Math.floor(diff / 60000)} мин`, colorClass: "text-red-400" };
  if (hours < 24) return { text: `${Math.floor(hours)} ч ${Math.floor((diff % 3600000) / 60000)} мин`, colorClass: "text-yellow-400" };
  return { text: `${Math.floor(hours / 24)} дн ${Math.floor(hours % 24)} ч`, colorClass: "text-green-400" };
}

export function getTimeBgClass(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "text-red-400";
  const hours = diff / 3600000;
  if (hours < 1) return "text-red-400";
  if (hours < 24) return "text-yellow-400";
  return "text-green-400";
}

export function deadline48h(): string {
  return new Date(Date.now() + 48 * 3600000).toISOString();
}

export function nextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1;
}
