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
});
