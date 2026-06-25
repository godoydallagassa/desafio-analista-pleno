const { pool } = require("../../db/pool");

const listarVelorios = async (registroObito) => {
  let query = `
    SELECT
      p.nome || ' ' || p.sobrenome AS nome_completo,
      v.sala_velorio,
      v.inicio_velorio,
      v.inicio_sepultamento,
      v.local_sepultamento,
      r.funeraria,
      v.id
    FROM velorios v
    INNER JOIN registros_obitos r ON v.registro_obito_id = r.id
    INNER JOIN pessoas p ON r.pessoa_id = p.id
    WHERE v.local_velorio = 'Memorial Luto Curitiba'
  `;

  const params = [];

  if (registroObito) {
    query += ` AND r.numero_registro ILIKE $1`;
    params.push(`%${registroObito}%`);
  }

  query += ` ORDER BY v.inicio_velorio ASC`;

  const result = await pool.query(query, params);
  return result.rows;
};

const buscarVelorioPorId = async (id) => {
  const query = `
    SELECT
      p.nome || ' ' || p.sobrenome AS nome_completo,
      v.sala_velorio,
      v.inicio_velorio,
      v.inicio_sepultamento,
      v.local_sepultamento,
      r.funeraria,
      v.id
    FROM velorios v
    INNER JOIN registros_obitos r ON v.registro_obito_id = r.id
    INNER JOIN pessoas p ON r.pessoa_id = p.id
    WHERE v.id = $1
      AND v.local_velorio = 'Memorial Luto Curitiba'
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

module.exports = { listarVelorios, buscarVelorioPorId };