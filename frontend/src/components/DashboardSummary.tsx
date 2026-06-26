import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Velorio } from "@/types/velorio";
import { formatarHora, timestampParaData } from "@/utils/formatDate";

interface DashboardSummaryProps {
  velorios: Velorio[];
}

export default function DashboardSummary({ velorios }: DashboardSummaryProps) {
  const salasEmUso = new Set(
    velorios.map((v) => v.sala_velorio).filter(Boolean)
  ).size;

  const agora = new Date();

  const proximoSepultamento = velorios
    .filter((v) => {
      const dataSepultamento = timestampParaData(v.inicio_sepultamento);
      return dataSepultamento && dataSepultamento.getTime() >= agora.getTime();
    })
    .sort(
      (a, b) =>
        timestampParaData(a.inicio_sepultamento)!.getTime() -
        timestampParaData(b.inicio_sepultamento)!.getTime()
    )[0];

  const horaProximoSepultamento = proximoSepultamento
    ? formatarHora(proximoSepultamento.inicio_sepultamento)
    : "-";

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        size="sm"
        className="border-zinc-800 bg-zinc-900/80 text-zinc-50"
      >
        <CardHeader>
          <CardTitle className="text-xs font-medium text-zinc-400">
            Velórios em andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-2xl">{velorios.length}</strong>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="border-zinc-800 bg-zinc-900/80 text-zinc-50"
      >
        <CardHeader>
          <CardTitle className="text-xs font-medium text-zinc-400">
            Salas em uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-2xl">{salasEmUso}</strong>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="border-zinc-800 bg-zinc-900/80 text-zinc-50"
      >
        <CardHeader>
          <CardTitle className="text-xs font-medium text-zinc-400">
            Próximo sepultamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-2xl">{horaProximoSepultamento}</strong>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="border-zinc-800 bg-zinc-900/80 text-zinc-50"
      >
        <CardHeader>
          <CardTitle className="text-xs font-medium text-zinc-400">
            Total listado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <strong className="text-2xl">{velorios.length}</strong>
        </CardContent>
      </Card>
    </section>
  );
}
