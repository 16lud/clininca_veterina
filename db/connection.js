const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinica_veterinaria'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco ❌', err);
    } else {
        console.log('Banco de dados conectado com sucesso ✅');
    }
});

module.exports = connection;
