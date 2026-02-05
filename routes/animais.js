const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM animais', (err, result) => {
        if (err) throw err;
        res.render('animais-list', { animais: result });
    });
});

// FORMULÁRIO DE CADASTRO
router.get('/add', (req, res) => {
    db.query('SELECT * FROM donos', (err, donos) => {
        if (err) return res.send('Erro ao carregar donos');
        res.render('animais-add', { donos: donos, animal: null });
    });
});

// SALVAR ANIMAL
router.post('/add', (req, res) => {
    const { nome, idade, especie, raca, id_dono } = req.body;
    const sql = 'INSERT INTO animais (nome, idade, especie, raca, id_dono) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade, especie, raca, id_dono], err => {
        if (err) return res.send('Erro ao salvar animal');
        res.redirect('/animais');
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
