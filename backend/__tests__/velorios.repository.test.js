jest.mock("../src/db/pool", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require("../src/db/pool");
const veloriosRepository = require("../src/modules/velorios/velorios.repository");

describe("velorios.repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pool.query.mockResolvedValue({ rows: [] });
  });

  it("lista apenas velorios ativos e ordena por inicio de sepultamento", async () => {
    await veloriosRepository.listarVelorios();

    const [query, params] = pool.query.mock.calls[0];

    expect(query).toContain("v.local_velorio = 'Memorial Luto Curitiba'");
    expect(query).toContain("v.inicio_velorio <=");
    expect(query).toContain("v.fim_velorio >=");
    expect(query).toContain("America/Sao_Paulo");
    expect(query).toContain("ORDER BY v.inicio_sepultamento ASC");
    expect(params).toEqual([]);
  });

  it("filtra por registro de obito usando parametro SQL", async () => {
    await veloriosRepository.listarVelorios("REG-2026-0015");

    const [query, params] = pool.query.mock.calls[0];

    expect(query).toContain("r.numero_registro ILIKE $1");
    expect(query).toContain("ORDER BY v.inicio_sepultamento ASC");
    expect(params).toEqual(["%REG-2026-0015%"]);
  });

  it("busca velorio por ID usando parametro SQL", async () => {
    const velorio = {
      id: 15,
      nome_completo: "Geraldo Fernandes",
    };
    pool.query.mockResolvedValueOnce({ rows: [velorio] });

    const result = await veloriosRepository.buscarVelorioPorId(15);
    const [query, params] = pool.query.mock.calls[0];

    expect(query).toContain("WHERE v.id = $1");
    expect(query).toContain("v.local_velorio = 'Memorial Luto Curitiba'");
    expect(params).toEqual([15]);
    expect(result).toBe(velorio);
  });

  it("retorna null quando nao encontra velorio por ID", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const result = await veloriosRepository.buscarVelorioPorId(999);
    const [, params] = pool.query.mock.calls[0];

    expect(params).toEqual([999]);
    expect(result).toBeNull();
  });
});
