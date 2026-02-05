const db = require('../db');

const sql = `
  SELECT a.id_animal, a.nome, a.idade, a.especie, a.raca, a.id_dono, a.id_vet,
         d.nome AS dono_nome, v.nome AS vet_nome
  FROM animais a
  LEFT JOIN donos d ON a.id_dono = d.id_dono
  LEFT JOIN veterinarios v ON a.id_vet = v.id_vet
  ORDER BY a.id_animal DESC
  LIMIT 20
`;

db.query(sql, (err, results) => {
  if (err) {
    console.error('Erro ao buscar animais:', err);
    db.end();
    process.exit(1);
  }
  console.table(results);
  db.end();
});
