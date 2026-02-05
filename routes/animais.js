const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    const sql = `
        SELECT a.id_animal AS id,
               a.nome,
               a.idade,
               a.especie,
               a.raca,
               d.nome AS dono_nome,
                   v.nome AS veterinario_nome
        FROM animais a
        LEFT JOIN donos d ON a.id_dono = d.id_dono
            LEFT JOIN veterinarios v ON a.id_vet = v.id_vet
        ORDER BY a.nome
    `;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('animais-list', { animais: result });
    });
});

// FORMULÁRIO DE CADASTRO
router.get('/add', (req, res) => {
    db.query('SELECT * FROM donos ORDER BY nome', (err, donos) => {
        if (err) return res.send('Erro ao carregar donos');
        db.query('SELECT id_vet, nome FROM veterinarios ORDER BY nome', (err2, vets) => {
            if (err2) return res.send('Erro ao carregar veterinários');
            res.render('animais-add', { donos: donos, veterinarios: vets, animal: null });
        });
    });
});

// SALVAR ANIMAL
router.post('/add', (req, res) => {
    const { nome, idade, especie, raca, id_dono, id_vet } = req.body;
    const sql = 'INSERT INTO animais (nome, idade, especie, raca, id_dono, id_vet) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [nome, idade, especie, raca, id_dono || null, id_vet || null];
    db.query(sql, params, err => {
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
