const db = require('../db');

const tables = ['animais', 'donos', 'veterinarios'];

async function inspect() {
  for (const t of tables) {
    await new Promise((resolve, reject) => {
      const sql = `SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'clinica_veterinaria' AND TABLE_NAME = ?`;
      db.query(sql, [t], (err, results) => {
        if (err) return reject(err);
        console.log(`\nTabela: ${t}`);
        results.forEach(r => console.log(` - ${r.COLUMN_NAME} : ${r.COLUMN_TYPE}`));
        resolve();
      });
    });
  }
  db.end();
}

inspect().catch(err => { console.error(err); db.end(); process.exit(1); });
