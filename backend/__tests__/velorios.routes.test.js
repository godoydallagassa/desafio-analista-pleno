const request = require("supertest");

jest.mock("../src/modules/velorios/velorios.repository", () => ({
  listarVelorios: jest.fn(),
  buscarVelorioPorId: jest.fn(),
}));

const app = require("../src/app");
const veloriosRepository = require("../src/modules/velorios/velorios.repository");
const { formatarHora } = require("../src/pdf/banner.service");

const veloriosAtivos = [
  {
    id: 15,
    nome_completo: "Geraldo Fernandes",
    sala_velorio: "Sala Lírio",
    inicio_velorio: "2026-06-26T10:00:00",
    inicio_sepultamento: "2026-06-26T08:00:00",
    local_sepultamento: "Cemitério São Francisco",
    funeraria: "Funerária Bom Pastor",
  },
  {
    id: 7,
    nome_completo: "José Almeida",
    sala_velorio: "Sala Margarida",
    inicio_velorio: "2026-06-26T06:00:00",
    inicio_sepultamento: "2026-06-26T10:00:00",
    local_sepultamento: "Cemitério Municipal",
    funeraria: "Funerária São Miguel",
  },
];

const pdfParser = (res, callback) => {
  const chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => callback(null, Buffer.concat(chunks)));
};

describe("GET /api/velorios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna status 200 e a lista de velorios fornecida pelo repository", async () => {
    veloriosRepository.listarVelorios.mockResolvedValue(veloriosAtivos);

    const response = await request(app).get("/api/velorios");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((velorio) => velorio.nome_completo)).toEqual([
      "Geraldo Fernandes",
      "José Almeida",
    ]);
    expect(veloriosRepository.listarVelorios).toHaveBeenCalledWith(undefined);
  });
});

describe("GET /api/velorios?registroObito=...", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("filtra corretamente pelo registro de obito existente", async () => {
    veloriosRepository.listarVelorios.mockResolvedValue([veloriosAtivos[0]]);

    const response = await request(app).get(
      "/api/velorios?registroObito=REG-2026-0015"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(15);
    expect(veloriosRepository.listarVelorios).toHaveBeenCalledWith(
      "REG-2026-0015"
    );
  });

  it("retorna array vazio quando o registro de obito nao existe", async () => {
    veloriosRepository.listarVelorios.mockResolvedValue([]);

    const response = await request(app).get(
      "/api/velorios?registroObito=REG-INEXISTENTE"
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(veloriosRepository.listarVelorios).toHaveBeenCalledWith(
      "REG-INEXISTENTE"
    );
  });
});

describe("GET /api/velorios/:id/banner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("retorna PDF para ID valido", async () => {
    veloriosRepository.buscarVelorioPorId.mockResolvedValue(veloriosAtivos[0]);

    const response = await request(app)
      .get("/api/velorios/15/banner")
      .buffer(true)
      .parse(pdfParser);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/pdf/);

    expect(response.body.length).toBeGreaterThan(0);
    expect(veloriosRepository.buscarVelorioPorId).toHaveBeenCalledWith(15);
  });

  it("retorna 400 para ID invalido", async () => {
    const response = await request(app).get("/api/velorios/abc/banner");

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("ID inv");
    expect(veloriosRepository.buscarVelorioPorId).not.toHaveBeenCalled();
  });

  it("retorna 404 quando o velorio nao existe", async () => {
    veloriosRepository.buscarVelorioPorId.mockResolvedValue(null);

    const response = await request(app).get("/api/velorios/999/banner");

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("encontrado");
    expect(veloriosRepository.buscarVelorioPorId).toHaveBeenCalledWith(999);
  });
});

describe("formatarHora", () => {
  it("extrai apenas hora e minuto sem deslocar fuso horario", () => {
    expect(formatarHora("2026-06-26T10:00:00")).toBe("10:00");
    expect(formatarHora("2026-06-26 08:00:00")).toBe("08:00");
  });

  it("retorna hifen quando nao recebe horario", () => {
    expect(formatarHora(null)).toBe("-");
    expect(formatarHora(undefined)).toBe("-");
  });
});
