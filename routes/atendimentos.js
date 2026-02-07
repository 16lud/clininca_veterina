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

// API: Retorna veterinários filtrados por especialidade (para AJAX no frontend)
router.get('/api/veterinarios-por-especialidade/:servico_id', (req, res) => {
  const servicoId = req.params.servico_id;

  // Buscar serviço
  db.query('SELECT * FROM servicos WHERE id_servico = ?', [servicoId], (err, servicos) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar serviço' });
    }
    
    if (!servicos || servicos.length === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    const servico = servicos[0];
    
    // Buscar todos os veterinários
    db.query('SELECT * FROM veterinarios ORDER BY nome', (err, veterinarios) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar veterinários' });
      }

      // Filtrar veterinários por especialidade baseado no nome_servico e especialidade do vet
      const nomeServico = (servico.nome_servico || '').toLowerCase();
      const descricaoServico = (servico.descricao || '').toLowerCase();

      const vetsFiltrados = veterinarios.filter(vet => {
        if (!vet.especialidade) return true; // Mostrar vets sem especialidade

        const especialidadeVet = vet.especialidade.toLowerCase();

        // Buscar correspondência de palavras-chave
        if (nomeServico.includes('cardiologia') || descricaoServico.includes('cardiologia')) {
          return especialidadeVet.includes('cardio');
        }
        if (nomeServico.includes('dermatologia') || descricaoServico.includes('dermatologia')) {
          return especialidadeVet.includes('dermat');
        }
        if (nomeServico.includes('ortopedia') || descricaoServico.includes('ortopedia')) {
          return especialidadeVet.includes('ortop');
        }
        if (nomeServico.includes('oftalmologia') || descricaoServico.includes('oftalmologia')) {
          return especialidadeVet.includes('oftalmolog');
        }
        if (nomeServico.includes('endocrinologia') || descricaoServico.includes('endocrinologia')) {
          return especialidadeVet.includes('endocrin');
        }
        if (nomeServico.includes('neurologia') || descricaoServico.includes('neurologia')) {
          return especialidadeVet.includes('neurolog');
        }
        if (nomeServico.includes('anestesiologia') || descricaoServico.includes('anestesiologia')) {
          return especialidadeVet.includes('anestesio');
        }
        if (nomeServico.includes('cirurgia') || descricaoServico.includes('cirurgia')) {
          return especialidadeVet.includes('cirurg');
        }
        if (nomeServico.includes('clínica') || nomeServico.includes('clinica') || descricaoServico.includes('clínica')) {
          return especialidadeVet.includes('clínica') || especialidadeVet.includes('clinica') || especialidadeVet.includes('geral');
        }
        if (nomeServico.includes('exame') || nomeServico.includes('diagnóstico') || descricaoServico.includes('exame')) {
          return especialidadeVet.includes('diagnóstico') || especialidadeVet.includes('diagnostico') || especialidadeVet.includes('radiolog') || especialidadeVet.includes('ultrassom');
        }

        return true;
      });

      res.json(vetsFiltrados);
    });
  });
});

// recebe dados e vai para pagamento
router.post('/pagamento', (req, res) => {
  req.session.atendimento = req.body;
  
  const { id_animal, id_servico, id_vet } = req.body;
  
  // Query para buscar dados legíveis (nome do animal, dono, serviço, vet, valor)
  const query = `
    SELECT 
      a.nome as nome_animal,
      d.nome as nome_dono,
      s.nome_servico,
      s.preco_base,
      v.nome AS nome_vet
    FROM animais a
    LEFT JOIN donos d ON a.id_dono = d.id_dono
    CROSS JOIN (SELECT nome_servico, preco_base FROM servicos WHERE id_servico = ?) s
    CROSS JOIN (SELECT nome FROM veterinarios WHERE id_vet = ?) v
    WHERE a.id_animal = ?
  `;
  
  db.query(query, [id_servico, id_vet, id_animal], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao buscar dados do atendimento');
    }
    
    if (!results || results.length === 0) {
      return res.status(404).send('Dados do atendimento não encontrados');
    }
    
    const dados = results[0];
    
    // Criar objeto com dados legíveis para exibição
    const atendimentoLegivel = {
      // IDs para envio ao servidor (hidden fields)
      id_animal,
      id_servico,
      id_vet,
      data_atendimento: req.body.data_atendimento,
      horario: req.body.horario,
      observacoes: req.body.observacoes,
      
      // Dados legíveis para exibição
      nome_animal: dados.nome_animal || '-',
      nome_dono: dados.nome_dono || '-',
      nome_servico: dados.nome_servico || '-',
      nome_vet: dados.nome_vet || '-'
    };
    
    const valor = dados.preco_base ? parseFloat(dados.preco_base) : 0;
    
    res.render('pagamentos', { 
      atendimento: atendimentoLegivel,
      valor
    });
  });
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
    INSERT INTO atendimentos
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

// agendar sem pagamento — insere atendimento diretamente
router.post('/agendar', (req, res) => {
  const {
    id_animal,
    id_servico,
    id_vet,
    data_atendimento,
    horario,
    observacoes
  } = req.body;

  const sqlAtendimento = `
    INSERT INTO atendimentos
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
    res.redirect('/atendimentos');
  });
});

// lista de atendimentos
router.get('/', (req, res) => {

    const sql = `
    SELECT
      at.id_atendimento,
      an.nome AS animal,
      d.nome AS dono,
      s.nome_servico AS servico,
      v.nome AS veterinario,
      v.especialidade AS especialidade,
      at.data_atendimento,
      at.horario,
      pg.forma_pagamento,
      pg.valor
    FROM atendimentos at
    JOIN animais an ON at.id_animal = an.id_animal
    JOIN donos d ON an.id_dono = d.id_dono
    JOIN servicos s ON at.id_servico = s.id_servico
    JOIN veterinarios v ON at.id_vet = v.id_vet
    LEFT JOIN pagamentos pg ON pg.id_atendimento = at.id_atendimento
    ORDER BY at.data_atendimento, at.horario
  `;

  db.query(sql, (err, atendimentos) => {
    if (err) throw err;
    res.render('atendimentos-list', { atendimentos });
  });
});

module.exports = router;