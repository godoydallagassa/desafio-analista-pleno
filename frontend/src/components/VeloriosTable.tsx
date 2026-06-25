import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Velorio } from "@/types/velorio";
import { formatarDataHora, formatarHora } from "@/utils/formatDate";
import { baixarBannerPdf } from "@/services/veloriosApi";

interface VeloriosTableProps {
  velorios: Velorio[];
  carregando: boolean;
  erro: string | null;
}

export default function VeloriosTable({
  velorios,
  carregando,
  erro,
}: VeloriosTableProps) {
  if (carregando) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
          ))}
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="rounded-xl border border-red-900/50 bg-red-950/30 p-6">
        <p className="text-sm text-red-400">{erro}</p>
      </section>
    );
  }

  if (velorios.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-zinc-800">
          <p className="text-sm text-zinc-500">
            Nenhum velório encontrado no Memorial Luto Curitiba.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">Falecido</TableHead>
            <TableHead className="text-zinc-400">Sala</TableHead>
            <TableHead className="text-zinc-400">Início do Velório</TableHead>
            <TableHead className="text-zinc-400">Início do Sepultamento</TableHead>
            <TableHead className="text-zinc-400">Local do Sepultamento</TableHead>
            <TableHead className="text-zinc-400">Funerária</TableHead>
            <TableHead className="text-zinc-400">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {velorios.map((velorio) => (
            <TableRow
              key={velorio.id}
              className="border-zinc-800 text-zinc-50 hover:bg-zinc-800/50"
            >
              <TableCell className="font-medium">
                {velorio.nome_completo}
              </TableCell>
              <TableCell>{velorio.sala_velorio || "—"}</TableCell>
              <TableCell>{formatarDataHora(velorio.inicio_velorio)}</TableCell>
              <TableCell>
                {velorio.inicio_sepultamento
                  ? formatarHora(velorio.inicio_sepultamento)
                  : "—"}
              </TableCell>
              <TableCell>{velorio.local_sepultamento}</TableCell>
              <TableCell>{velorio.funeraria}</TableCell>
              <TableCell>
                <Button
                  onClick={() => baixarBannerPdf(velorio.id)}
                  className="h-8 bg-amber-600/80 px-3 text-xs text-zinc-50 hover:bg-amber-600"
                >
                  Exportar Banner
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}