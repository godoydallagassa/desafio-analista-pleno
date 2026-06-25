const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import type { Velorio } from "@/types/velorio";

export async function listarVelorios(
  registroObito?: string
): Promise<Velorio[]> {
  const params = new URLSearchParams();
  if (registroObito) {
    params.set("registroObito", registroObito);
  }

  const url = `${API_URL}/api/velorios${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar velórios");
  }

  return response.json();
}

export function baixarBannerPdf(id: number): void {
  window.open(`${API_URL}/api/velorios/${id}/banner`, "_blank");
}