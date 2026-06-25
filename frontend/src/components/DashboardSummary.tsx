import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Velorio } from "@/types/velorio";

interface DashboardSummaryProps {
  velorios: Velorio[];
}

export default function DashboardSummary({ velorios }: DashboardSummaryProps) {
  const salasEmUso = new Set(
    velorios.map((v) => v.sala_velorio).filter(Boolean)
  ).size;

  const proximoSepultamento = velorios
    .filter((v) => v.inicio_sepultamento)
    .sort(
      (a, b) =>
        new Date(a.inicio_sepultamento).getTime() -
        new Date(b.inicio_sepultamento).getTime()
    )[0];

  const horaProximoSepultamento = proximoSepultamento
    ? new Date(proximoSepultamento.inicio_sepultamento).toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <section className="grid gap-4 md:grid-cols-4">
      <Card className="border-zinc-800 bg-zinc-900/80 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-400">
            Velórios em andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-3xl">{velorios.length}</strong>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/80 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-400">
            Salas em uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-3xl">{salasEmUso}</strong>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/80 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-400">
            Próximo sepultamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-lg">{horaProximoSepultamento}</strong>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/80 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-400">
            Total listado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-3xl">{velorios.length}</strong>
        </CardContent>
      </Card>
    </section>
  );
}