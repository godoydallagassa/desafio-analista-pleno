const veloriosService = require("./velorios.service");

const listar = async (req, res, next) => {
  try {
    const { registroObito } = req.query;

    if (registroObito && typeof registroObito !== "string") {
      return res.status(400).json({ error: "Filtro inválido" });
    }

    const velorios = await veloriosService.listarVelorios(registroObito);
    res.json(velorios);
  } catch (err) {
    next(err);
  }
};

const buscarBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dados = await veloriosService.buscarVelorioPorId(id);
    res.json(dados);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, buscarBanner };