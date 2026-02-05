const db = require('../db');

const sql = `ALTER TABLE animais ADD COLUMN IF NOT EXISTS id_vet INT(10) UNSIGNED NULL`;

// MySQL doesn't support IF NOT EXISTS for ADD COLUMN in all versions; handle gracefully
db.query("SHOW COLUMNS FROM animais LIKE 'id_vet'", (err, results) => {
  if (err) {
    console.error(err);
    db.end();
    process.exit(1);
  }
  if (results.length > 0) {
    console.log('Coluna id_vet já existe');
    db.end();
    process.exit(0);
  }

  db.query("ALTER TABLE animais ADD COLUMN id_vet INT(10) UNSIGNED NULL", (err2) => {
    if (err2) {
      console.error('Erro ao adicionar coluna id_vet:', err2);
      db.end();
      process.exit(1);
    }
    console.log('Coluna id_vet adicionada com sucesso');
    db.end();
  });
});
