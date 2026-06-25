const PDFDocument = require("pdfkit");
const veloriosService = require("../modules/velorios/velorios.service");

const formatarDataHora = (timestamp) => {
  if (!timestamp) return "—";
  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

    // Cabeçalho
    doc.fontSize(20).font("Helvetica-Bold").text("Memorial Luto Curitiba", {
      align: "center",
    });

    doc.moveDown(0.5);
    doc.fontSize(14).font("Helvetica").text("Banner de Velório", {
      align: "center",
    });

    doc.moveDown(1.5);

    // Linha separadora
    doc
      .moveTo(60, doc.y)
      .lineTo(535, doc.y)
      .strokeColor("#999")
      .stroke();

    doc.moveDown(1.5);

    // Dados do velório
    const campos = [
      { label: "Falecido", valor: dados.nome_completo },
      { label: "Início do Velório", valor: formatarDataHora(dados.inicio_velorio) },
      { label: "Início do Sepultamento", valor: formatarDataHora(dados.inicio_sepultamento) },
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