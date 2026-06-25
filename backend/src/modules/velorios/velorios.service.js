const veloriosRepository = require("./velorios.repository");

const listarVelorios = async (registroObito) => {
  return veloriosRepository.listarVelorios(registroObito);
};

const buscarVelorioPorId = async (id) => {
  if (!id || isNaN(Number(id))) {
    const error = new Error("ID inválido");
    error.status = 400;
    throw error;
  }

  const velorio = await veloriosRepository.buscarVelorioPorId(Number(id));

  if (!velorio) {
    const error = new Error("Velório não encontrado");
    error.status = 404;
    throw error;
  }

  return velorio;
};

module.exports = { listarVelorios, buscarVelorioPorId };