import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VelorioFiltersProps {
  registroObito: string;
  onRegistroObitoChange: (valor: string) => void;
  onBuscar: () => void;
  onLimpar: () => void;
}

export default function VelorioFilters({
  registroObito,
  onRegistroObitoChange,
  onBuscar,
  onLimpar,
}: VelorioFiltersProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onBuscar();
    }
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Registro de Óbito
          </label>
          <Input
            placeholder="Digite o número do registro..."
            value={registroObito}
            onChange={(e) => onRegistroObitoChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-zinc-700 bg-zinc-950 text-zinc-50 placeholder:text-zinc-500"
          />
        </div>

        <Button
          onClick={onBuscar}
          className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
        >
          Buscar
        </Button>

        <Button
          onClick={onLimpar}
          variant="outline"
          className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50"
        >
          Limpar
        </Button>
      </div>
    </section>
  );
}