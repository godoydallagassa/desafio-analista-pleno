import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import DashboardSummary from "@/components/DashboardSummary";
import VelorioFilters from "@/components/VelorioFilters";
import VeloriosTable from "@/components/VeloriosTable";
import { listarVelorios } from "@/services/veloriosApi";
import type { Velorio } from "@/types/velorio";

function App() {
  const [velorios, setVelorios] = useState<Velorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [registroObito, setRegistroObito] = useState("");

  const buscar = useCallback(async (filtro?: string) => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarVelorios(filtro || undefined);
      setVelorios(dados);
    } catch {
      setErro("Erro ao carregar os velórios. Verifique a conexão com a API.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const handleBuscar = () => {
    buscar(registroObito);
  };

  const handleLimpar = () => {
    setRegistroObito("");
    buscar();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5">
        <header className="border-b border-zinc-800 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Painel de velórios
            </h1>
            <Badge className="w-fit border border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/10">
              Memorial Luto Curitiba
            </Badge>
          </div>
        </header>

        <DashboardSummary velorios={velorios} />

        <VelorioFilters
          registroObito={registroObito}
          onRegistroObitoChange={setRegistroObito}
          onBuscar={handleBuscar}
          onLimpar={handleLimpar}
        />

        <VeloriosTable
          velorios={velorios}
          carregando={carregando}
          erro={erro}
        />
      </div>
    </main>
  );
}

export default App;
