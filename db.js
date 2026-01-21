const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinica_veterinaria'
});

db.connect(err => {
    if (err) {
        console.log('Erro ao conectar no banco ❌');
        return;
    }
    console.log('Banco de dados conectado com sucesso ✅');
});

module.exports = db;
