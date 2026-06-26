function extrairPartes(timestamp: string) {
  const match = timestamp.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/
  );

  if (!match) return null;

  const [, ano, mes, dia, hora, minuto] = match;
  return { ano, mes, dia, hora, minuto };
}

export function timestampParaData(timestamp: string): Date | null {
  const partes = extrairPartes(timestamp);

  if (!partes) {
    const data = new Date(timestamp);
    return Number.isNaN(data.getTime()) ? null : data;
  }

  return new Date(
    Number(partes.ano),
    Number(partes.mes) - 1,
    Number(partes.dia),
    Number(partes.hora),
    Number(partes.minuto)
  );
}

export function formatarDataHora(timestamp: string): string {
  if (!timestamp) return "—";

  const partes = extrairPartes(timestamp);

  if (partes) {
    return `${partes.dia}/${partes.mes}/${partes.ano}, ${partes.hora}:${partes.minuto}`;
  }

  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export function formatarHora(timestamp: string): string {
  if (!timestamp) return "—";

  const partes = extrairPartes(timestamp);

  if (partes) {
    return `${partes.hora}:${partes.minuto}`;
  }

  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}
