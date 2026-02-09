const express = require('express');
const router = express.Router();
const db = require('../db');

// =====================
// LISTAR ANIMAIS
// =====================
router.get('/', (req, res) => {
    const sql = `
        SELECT 
            a.id_animal,
            a.nome,
            a.idade,
            a.especie,
            a.raca,
            d.nome AS dono_nome,
            v.nome AS veterinario_nome,
            v.especialidade AS veterinario_especialidade
        FROM animais a
        LEFT JOIN donos d ON a.id_dono = d.id_dono
        LEFT JOIN veterinarios v ON a.id_vet = v.id_vet
        ORDER BY a.nome
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send('Erro ao buscar animais');
        res.render('animais-list', { animais: result });
    });
});

// =====================
// FORM ADD ANIMAL
// =====================
router.get('/add', (req, res) => {
    db.query('SELECT * FROM donos ORDER BY nome', (err, donos) => {
        if (err) return res.send('Erro ao carregar donos');

        db.query('SELECT id_vet, nome FROM veterinarios ORDER BY nome', (err2, vets) => {
            if (err2) return res.send('Erro ao carregar veterinários');

            res.render('animais-add', {
                animal: null,
                donos,
                veterinarios: vets
            });
        });
    });
});

// =====================
// SALVAR ANIMAL
// =====================
router.post('/add', (req, res) => {
    const { nome, idade, especie, raca, id_dono, id_vet } = req.body;

    const sql = `
        INSERT INTO animais (nome, idade, especie, raca, id_dono, id_vet)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nome, idade, especie, raca, id_dono || null, id_vet || null],
        err => {
            if (err) return res.send('Erro ao cadastrar animal');
            res.redirect('/animais');
        }
    );
});

// =====================
// FORM EDITAR ANIMAL
// =====================
router.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM animais WHERE id_animal = ?';

    db.query(sql, [id], (err, result) => {
        if (err || result.length === 0)
            return res.send('Animal não encontrado');

        db.query('SELECT * FROM donos ORDER BY nome', (err2, donos) => {
            if (err2) return res.send('Erro ao carregar donos');

            db.query('SELECT id_vet, nome FROM veterinarios ORDER BY nome', (err3, vets) => {
                if (err3) return res.send('Erro ao carregar veterinários');

                res.render('animais-add', {
                    animal: result[0],
                    donos,
                    veterinarios: vets
                });
            });
        });
    });
});

// =====================
// ATUALIZAR ANIMAL
// =====================
router.post('/edit/:id', (req, res) => {
    const { nome, idade, especie, raca, id_dono, id_vet } = req.body;

    const sql = `
        UPDATE animais
        SET nome = ?, idade = ?, especie = ?, raca = ?, id_dono = ?, id_vet = ?
        WHERE id_animal = ?
    `;

    db.query(
        sql,
        [nome, idade, especie, raca, id_dono || null, id_vet || null, req.params.id],
        err => {
            if (err) return res.send('Erro ao atualizar animal');
            res.redirect('/animais');
        }
    );
});

// =====================
// EXCLUIR ANIMAL
// =====================
router.get('/delete/:id', (req, res) => {
    db.query(
        'DELETE FROM animais WHERE id_animal = ?',
        [req.params.id],
        err => {
            if (err) return res.send('Erro ao excluir animal');
            res.redirect('/animais');
        }
    );
});

module.exports = router;
