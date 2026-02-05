const db = require('../db');

const sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'clinica_veterinaria'";

db.query(sql, (err, results) => {
  if (err) {
    console.error(err);
    db.end();
    process.exit(1);
  }
  console.log('Tabelas no banco:');
  results.forEach(r => console.log(` - ${r.TABLE_NAME}`));
  db.end();
});
