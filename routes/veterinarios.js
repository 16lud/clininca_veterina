const express = require('express');
const router = express.Router();
const db = require('../db');
const regexCRMV = /^CRMV-[A-Z]{2} [0-9]{5}$/;

router.post('/add', (req, res) => {
    const { nome, especialidade, celular, crmv } = req.body;

    if (!regexCRMV.test(crmv)) {
        return res.send('CRMV inválido. Use o formato: CRMV-SP 12345');
    }

    const sql = `
        INSERT INTO veterinarios (nome, especialidade, celular, crmv)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nome, especialidade, celular, crmv], err => {
        if (err) {
            console.error(err);
            return res.send('Erro ao salvar veterinário');
        }

        res.redirect('/veterinarios');
    });
});

// LISTAR
router.get('/', (req, res) => {
    db.query('SELECT * FROM veterinarios', (err, result) => {
        if (err) return res.send('Erro');
        res.render('veterinarios-list', { veterinarios: result });
    });
});

// FORM
router.get('/add', (req, res) => {
    res.render('veterinarios-add', { veterinario: null });
});

// SALVAR
router.post('/add', (req, res) => {
    const { nome, especialidade, telefone, crmv } = req.body;

    db.query(
        'INSERT INTO veterinarios (nome, especialidade, telefone, crmv) VALUES (?, ?, ?, ?)',
        [nome, especialidade, telefone, crmv],
        err => {
            if (err) return res.send('Erro ao salvar');
            res.redirect('/veterinarios');
        }
    );
});

// EXCLUIR
router.get('/delete/:id', (req, res) => {
    db.query(
        'DELETE FROM veterinarios WHERE id_vet = ?',
        [req.params.id],
        err => {
            if (err) return res.send('Erro');
            res.redirect('/veterinarios');
        }
    );
});

// FORM EDITAR
router.get('/edit/:id', (req, res) => {
    db.query(
        'SELECT * FROM veterinarios WHERE id_vet = ?',
        [req.params.id],
        (err, result) => {
            if (err || result.length === 0) return res.send('Veterinário não encontrado');
            res.render('veterinarios-add', { veterinario: result[0] });
        }
    );
});

// SALVAR EDIÇÃO
router.post('/edit/:id', (req, res) => {
    const { nome, especialidade, telefone, crmv } = req.body;
    db.query(
        'UPDATE veterinarios SET nome = ?, especialidade = ?, telefone = ?, crmv = ? WHERE id_vet = ?',
        [nome, especialidade, telefone, crmv, req.params.id],
        err => {
            if (err) return res.send('Erro ao atualizar');
            res.redirect('/veterinarios');
        }
    );
});

module.exports = router;
