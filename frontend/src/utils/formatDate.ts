export function formatarDataHora(timestamp: string): string {
  if (!timestamp) return "—";
  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarHora(timestamp: string): string {
  if (!timestamp) return "—";
  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}