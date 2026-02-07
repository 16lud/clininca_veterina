const express = require('express');
const router = express.Router();
const db = require('../db');

// abrir tela de agendamento
router.get('/agendar', (req, res) => {

  const sqlAnimais = 'SELECT * FROM animais';
  const sqlServicos = 'SELECT * FROM servicos';
  const sqlVets = 'SELECT * FROM veterinarios';

  db.query(sqlAnimais, (err, animais) => {
    if (err) throw err;

    db.query(sqlServicos, (err, servicos) => {
      if (err) throw err;

      db.query(sqlVets, (err, veterinarios) => {
        if (err) throw err;

        res.render('agendar', { animais, servicos, veterinarios });
      });
    });
  });
});

// recebe dados e vai para pagamento
router.post('/pagamento', (req, res) => {
  req.session.atendimento = req.body;
  res.render('pagamentos', { atendimento: req.body });
});

// finaliza pagamento e salva no banco
router.post('/finalizar', (req, res) => {

  const {
    id_animal,
    id_servico,
    id_vet,
    data_atendimento,
    horario,
    observacoes
  } = req.session.atendimento;

  const { forma_pagamento, valor } = req.body;

  const sqlAtendimento = `
    INSERT INTO atendimento
    (data_atendimento, horario, observacoes, id_animal, id_servico, id_vet)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlAtendimento, [
    data_atendimento,
    horario,
    observacoes,
    id_animal,
    id_servico,
    id_vet
  ], (err, result) => {
    if (err) throw err;

    const id_atendimento = result.insertId;

    const sqlPagamento = `
      INSERT INTO pagamentos
      (forma_pagamento, valor, data_pagamento, id_atendimento)
      VALUES (?, ?, CURDATE(), ?)
    `;

    db.query(sqlPagamento, [
      forma_pagamento,
      valor,
      id_atendimento
    ], err => {
      if (err) throw err;
      res.redirect('/atendimentos');
    });
  });
});

// lista de atendimentos
router.get('/', (req, res) => {

  const sql = `
    SELECT
      at.id_atendimento,
      an.nome AS animal,
      s.nome AS servico,
      v.nome AS veterinario,
      at.data_atendimento,
      at.horario,
      pg.forma_pagamento,
      pg.valor
    FROM atendimento at
    JOIN animais an ON at.id_animal = an.id
    JOIN servicos s ON at.id_servico = s.id
    JOIN veterinarios v ON at.id_vet = v.id
    LEFT JOIN pagamentos pg ON pg.id_atendimento = at.id_atendimento
    ORDER BY at.data_atendimento, at.horario
  `;

  db.query(sql, (err, atendimentos) => {
    if (err) throw err;
    res.render('atendimentos-list', { atendimentos });
  });
});

module.exports = router;