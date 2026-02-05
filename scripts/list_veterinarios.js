const db = require('../db');

const sql = `SELECT * FROM veterinarios`;

db.query(sql, (err, results) => {
  if (err) {
    console.error('Erro:', err);
    db.end();
    process.exit(1);
  }
  console.log('Veterinários no banco:');
  console.table(results);
  db.end();
});
