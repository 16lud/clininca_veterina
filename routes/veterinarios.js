const express = require('express');
const router = express.Router();
const db = require('../db');

// =========================
// LISTAR VETERINÁRIOS
// =========================
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM veterinarios ORDER BY nome';

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.send('Erro ao buscar veterinários');
        }

        res.render('veterinarios-list', { veterinarios: results });
    });
});

// =========================
// FORM ADD
// =========================
router.get('/add', (req, res) => {
    res.render('veterinarios-add', { veterinario: null });
});

// =========================
// SALVAR
// =========================
router.post('/add', (req, res) => {
    const { nome, crmv } = req.body;

    const sql = `
        INSERT INTO veterinarios (nome, crmv)
        VALUES (?, ?)
    `;

    db.query(sql, [nome, crmv], err => {
        if (err) {
            console.log(err);
            return res.send('Erro ao salvar veterinário');
        }

        res.redirect('/veterinarios');
    });
});

// =========================
// FORM EDITAR
// =========================
router.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM veterinarios WHERE id_veterinario = ?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err || result.length === 0)
            return res.send('Veterinário não encontrado');

        res.render('veterinarios-add', { veterinario: result[0] });
    });
});

// =========================
// ATUALIZAR
// =========================
router.post('/edit/:id', (req, res) => {
    const { nome, crmv } = req.body;

    const sql = `
        UPDATE veterinarios
        SET nome = ?, crmv = ?
        WHERE id_veterinario = ?
    `;

    db.query(sql, [nome, crmv, req.params.id], err => {
        if (err) {
            console.log(err);
            return res.send('Erro ao atualizar veterinário');
        }

        res.redirect('/veterinarios');
    });
});

// =========================
// EXCLUIR
// =========================
router.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM veterinarios WHERE id_veterinario = ?';

    db.query(sql, [req.params.id], err => {
        if (err) {
            console.log(err);
            return res.send('Erro ao excluir veterinário');
        }

        res.redirect('/veterinarios');
    });
});

module.exports = router;
