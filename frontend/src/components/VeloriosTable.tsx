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
import { formatarHora } from "@/utils/formatDate";
import { baixarBannerPdf } from "@/services/veloriosApi";

interface VeloriosTableProps {
  velorios: Velorio[];
  carregando: boolean;
  erro: string | null;
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      <strong className="text-sm font-medium text-zinc-100">{valor}</strong>
    </div>
  );
}

export default function VeloriosTable({
  velorios,
  carregando,
  erro,
}: VeloriosTableProps) {
  if (carregando) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 lg:min-h-0 lg:flex-1">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-zinc-800" />
          ))}
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 lg:min-h-0 lg:flex-1">
        <p className="text-sm text-red-400">{erro}</p>
      </section>
    );
  }

  if (velorios.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 lg:min-h-0 lg:flex-1">
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-zinc-800">
          <p className="text-sm text-zinc-500">
            Nenhum velório encontrado no Memorial Luto Curitiba.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-3 md:hidden">
        {velorios.map((velorio) => (
          <article
            key={velorio.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-50">
                  {velorio.nome_completo}
                </h2>
                <p className="text-sm text-zinc-400">
                  {velorio.sala_velorio || "-"}
                </p>
              </div>
              <Button
                onClick={() => baixarBannerPdf(velorio.id)}
                size="sm"
                className="bg-amber-600/80 text-xs text-zinc-50 hover:bg-amber-600"
              >
                Banner
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Campo
                label="Velório"
                valor={formatarHora(velorio.inicio_velorio)}
              />
              <Campo
                label="Sepultamento"
                valor={
                  velorio.inicio_sepultamento
                    ? formatarHora(velorio.inicio_sepultamento)
                    : "-"
                }
              />
              <Campo label="Local" valor={velorio.local_sepultamento} />
              <Campo label="Funerária" valor={velorio.funeraria} />
            </div>
          </article>
        ))}
      </section>

      <section className="hidden min-h-0 flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="h-9 text-zinc-400">Falecido</TableHead>
              <TableHead className="h-9 text-zinc-400">Sala</TableHead>
              <TableHead className="h-9 text-zinc-400">
                Início do Velório
              </TableHead>
              <TableHead className="h-9 text-zinc-400">
                Início do Sepultamento
              </TableHead>
              <TableHead className="h-9 text-zinc-400">
                Local do Sepultamento
              </TableHead>
              <TableHead className="h-9 text-zinc-400">Funerária</TableHead>
              <TableHead className="h-9 text-zinc-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {velorios.map((velorio) => (
              <TableRow
                key={velorio.id}
                className="border-zinc-800 text-zinc-50 hover:bg-zinc-800/50"
              >
                <TableCell className="py-2 font-medium">
                  {velorio.nome_completo}
                </TableCell>
                <TableCell className="py-2">
                  {velorio.sala_velorio || "-"}
                </TableCell>
                <TableCell className="py-2">
                  {formatarHora(velorio.inicio_velorio)}
                </TableCell>
                <TableCell className="py-2">
                  {velorio.inicio_sepultamento
                    ? formatarHora(velorio.inicio_sepultamento)
                    : "-"}
                </TableCell>
                <TableCell className="py-2">
                  {velorio.local_sepultamento}
                </TableCell>
                <TableCell className="py-2">{velorio.funeraria}</TableCell>
                <TableCell className="py-2">
                  <Button
                    onClick={() => baixarBannerPdf(velorio.id)}
                    size="sm"
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
    </>
  );
}
