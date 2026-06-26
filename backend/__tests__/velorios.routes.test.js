const request = require("supertest");

jest.mock("../src/modules/velorios/velorios.repository", () => ({
  listarVelorios: jest.fn(),
  buscarVelorioPorId: jest.fn(),
}));

const app = require("../src/app");
const veloriosRepository = require("../src/modules/velorios/velorios.repository");

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

const textoPdf = (valor) => Buffer.from(valor, "latin1").toString("hex");

describe("GET /api/velorios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna status 200, um array de velorios ativos ordenados por sepultamento", async () => {
    veloriosRepository.listarVelorios.mockResolvedValue(veloriosAtivos);

    const response = await request(app).get("/api/velorios");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((velorio) => velorio.nome_completo)).toEqual([
      "Geraldo Fernandes",
      "José Almeida",
    ]);
    expect(response.body[0].inicio_sepultamento).toBe("2026-06-26T08:00:00");
    expect(response.body[1].inicio_sepultamento).toBe("2026-06-26T10:00:00");
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
  });

  it("retorna PDF para ID valido mantendo horarios sem datas ou deslocamento UTC", async () => {
    veloriosRepository.buscarVelorioPorId.mockResolvedValue(veloriosAtivos[0]);

    const response = await request(app)
      .get("/api/velorios/15/banner")
      .buffer(true)
      .parse(pdfParser);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/pdf/);

    const pdfText = response.body.toString("latin1");

    expect(pdfText).toContain(textoPdf("10:00"));
    expect(pdfText).toContain(textoPdf("08:00"));
    expect(pdfText).not.toContain(textoPdf("07:00"));
    expect(pdfText).not.toContain("2026-06-26");
    expect(pdfText).not.toContain(textoPdf("26/06/2026"));
    expect(pdfText).not.toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(veloriosRepository.buscarVelorioPorId).toHaveBeenCalledWith(15);
  });
});
