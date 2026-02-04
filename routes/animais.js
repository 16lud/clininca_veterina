const express = require('express');
const router = express.Router();
const db = require('../db');

// =========================
// LISTAR ANIMAIS
// =========================
router.get('/', (req, res) => {
    const sql = `
        SELECT 
            animais.id_animal,
            animais.nome,
            animais.idade,
            animais.especie,
            animais.raca,
            donos.nome AS dono_nome,
            donos.cpf
        FROM animais
        LEFT JOIN donos ON animais.id_dono = donos.id_dono
        ORDER BY animais.nome
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.send('Erro ao listar animais');
        }
        res.render('animais-list', { animais: results });
    });
});


// =========================
// SALVAR ANIMAL
// =========================
router.post('/add', (req, res) => {
    const { nome, idade, especie, raca, id_dono } = req.body;

    const sql = `
        INSERT INTO animais (nome, idade, especie, raca, id_dono)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, idade, especie, raca, id_dono], err => {
        if (err) {
            console.log(err);
            return res.send('Erro ao salvar animal');
        }
        res.redirect('/animais');
    });
});


// =========================
// FORM EDITAR ANIMAL
// =========================
router.get('/edit/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT * FROM animais WHERE id_animal = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.send('Erro');
        res.render('animais-add', { animal: result[0] });
    });
});


// =========================
// ATUALIZAR ANIMAL
// =========================
router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nome, idade, especie, raca, id_dono, id_vet } = req.body;

    const sql = `
        UPDATE animais SET
        nome = ?, idade = ?, especie = ?, raca = ?, id_dono = ?, id_vet = ?
        WHERE id_animal = ?
    `;

    db.query(sql, [nome, idade, especie, raca, id_dono, id_vet, id], err => {
        if (err) {
            console.log(err);
            return res.send('Erro ao editar');
        }
        res.redirect('/animais');
    });
});

// =========================
// EXCLUIR ANIMAL
// =========================
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM animais WHERE id_animal = ?',
        [id],
        err => {
            if (err) {
                console.log(err);
                return res.send('Erro ao excluir animal');
            }
            res.redirect('/animais');
        }
    );
});

module.exports = router;



