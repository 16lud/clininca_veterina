const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM animais', (err, result) => {
        if (err) throw err;
        res.render('animais', { animais: result });
    });
});

router.post('/excluir/:id', (req, res) => {
    const sql = 'DELETE FROM animais WHERE id_animal = ?';

    db.query(sql, [req.params.id], err => {
        if (err) throw err;
        res.redirect('/animais');
    });
});

router.post('/editar/:id', (req, res) => {
    const { nome, idade, especie, raca } = req.body;

    const sql = `
        UPDATE animais 
        SET nome = ?, idade = ?, especie = ?, raca = ?
        WHERE id_animal = ?
    `;

    db.query(sql, [nome, idade, especie, raca, req.params.id], err => {
        if (err) throw err;
        res.redirect('/animais');
    });
});

module.exports = router;
