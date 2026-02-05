const db = require('../db');

const veterinarios = [
    { nome: 'Dr. Carlos Silva', especialidade: 'Clínico Geral', telefone: '84999999999', crmv: '2001' },
    { nome: 'Dra. Ana Santos', especialidade: 'Ortopedia', telefone: '84988888888', crmv: '2002' },
    { nome: 'Dr. Paulo Ferreira', especialidade: 'Dermatologia', telefone: '84977777777', crmv: '2003' },
    { nome: 'Dra. Mariana Costa', especialidade: 'Oftalmologia', telefone: '84966666666', crmv: '2004' }
];

let inserted = 0;

veterinarios.forEach(vet => {
    const sql = 'INSERT INTO veterinarios (nome, especialidade, telefone, crmv) VALUES (?, ?, ?, ?)';
    db.query(sql, [vet.nome, vet.especialidade, vet.telefone, vet.crmv], (err) => {
        if (err && err.code !== 'ER_DUP_ENTRY') {
            console.error('Erro ao inserir:', err);
        } else if (!err) {
            inserted++;
        }
        if (inserted + (veterinarios.length - inserted) === veterinarios.length) {
            console.log(`${inserted} veterinários inseridos com sucesso`);
            db.end();
        }
    });
});
