const PDFDocument = require("pdfkit");
const veloriosService = require("../modules/velorios/velorios.service");

const extrairPartes = (timestamp) => {
  const match = String(timestamp).match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/
  );

  if (!match) return null;

  const [, , , , hora, minuto] = match;
  return { hora, minuto };
};

const formatarHora = (timestamp) => {
  if (!timestamp) return "-";

  const partes = extrairPartes(timestamp);

  if (partes) {
    return `${partes.hora}:${partes.minuto}`;
  }

  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
};

const gerarBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dados = await veloriosService.buscarVelorioPorId(id);

    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="banner-velorio-${id}.pdf"`
    );

    doc.pipe(res);

    const campos = [
      { label: "Falecido", valor: dados.nome_completo },
      {
        label: "Início do Velório",
        valor: formatarHora(dados.inicio_velorio),
      },
      {
        label: "Início do Sepultamento",
        valor: formatarHora(dados.inicio_sepultamento),
      },
      { label: "Local do Sepultamento", valor: dados.local_sepultamento },
      { label: "Funerária Responsável", valor: dados.funeraria },
    ];

    campos.forEach(({ label, valor }) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#666")
        .text(label, { continued: false });

      doc
        .fontSize(13)
        .font("Helvetica")
        .fillColor("#000")
        .text(valor, { continued: false });

      doc.moveDown(1.2);
    });

    doc.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { gerarBanner };
