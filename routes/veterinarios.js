const express = require('express');
const router = express.Router();
const db = require('../db');

// LISTAR
router.get('/', (req, res) => {
    db.query('SELECT * FROM veterinarios', (err, result) => {
        if (err) return res.send('Erro');
        res.render('veterinarios-list', { veterinarios: result });
    });
});

// FORM
router.get('/add', (req, res) => {
    res.render('veterinarios-add', { vet: null });
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

module.exports = router;
