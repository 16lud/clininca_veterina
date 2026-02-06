const express = require('express');
const router = express.Router();
const db = require('../db');

// =====================
// LISTAR DONOS
// =====================
router.get('/', (req, res) => {
    const sql = 'SELECT id_dono, nome, cpf, telefone, email, endereco FROM donos ORDER BY nome';

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
    const { nome, cpf, email, endereco } = req.body;

    const sql = `
      INSERT INTO donos (nome, cpf, email, endereco)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nome, cpf, email, endereco], err => {
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
// Caso alguém acesse /donos/edit/ sem fornecer id, redireciona para a lista
router.get('/edit', (req, res) => {
    return res.redirect('/donos');
});

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
    const { nome, cpf, telefone, email, endereco } = req.body;

    db.query(
        'UPDATE donos SET nome = ?, cpf = ?, telefone = ?, email = ?, endereco = ? WHERE id_dono = ?',
        [nome, cpf, telefone, email, endereco, req.params.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.send('Erro ao atualizar dono');
            }
            res.redirect('/donos');
        }
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



