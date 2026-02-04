const express = require('express');
const router = express.Router();
const db = require('../db');

// =====================
// LISTAR DONOS
// =====================
router.get('/', (req, res) => {
    const sql = 'SELECT id_dono AS id, nome, cpf FROM donos ORDER BY nome';

    db.query(sql, (err, results) => {
        if (err) return res.send('Erro ao buscar donos');
        res.render('donos-list', { donos: results });
    });
});

// =====================
// FORM ADD DONO
// =====================
router.get('/add', (req, res) => {
    res.render('donos-add', { dono: null });
});

// =====================
// SALVAR DONO
// =====================
router.post('/add', (req, res) => {
    const { cpf, nome } = req.body;

    const sql = 'INSERT INTO donos (cpf, nome) VALUES (?, ?)';

    db.query(sql, [cpf, nome], err => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send('CPF já cadastrado');
            }
            console.log(err);
            return res.send('Erro ao cadastrar dono');
        }
        res.redirect('/donos');
    });
});


// =====================
// FORM EDITAR DONO
// =====================
router.get('/edit/:id', (req, res) => {
    db.query(
        'SELECT * FROM donos WHERE id_dono = ?',
        [req.params.id],
        (err, result) => {
            if (err || result.length === 0)
                return res.send('Dono não encontrado');

            res.render('donos-add', { dono: result[0] });
        }
    );
});

// =====================
// ATUALIZAR DONO
// =====================
router.post('/edit/:id', (req, res) => {
    const { nome, telefone } = req.body;

    db.query(
        'UPDATE donos SET nome = ?, telefone = ? WHERE id_dono = ?',
        [nome, telefone, req.params.id],
        () => res.redirect('/donos')
    );
});

// =====================
// EXCLUIR DONO
// =====================
router.get('/delete/:id', (req, res) => {
    db.query(
        'DELETE FROM donos WHERE id_dono = ?',
        [req.params.id],
        () => res.redirect('/donos')
    );
});

module.exports = router;



