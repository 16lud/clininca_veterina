const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM servicos';

    db.query(sql, (err, servicos) => {
        if (err) {
            console.error(err);
            return res.send('Erro ao carregar serviços');
        }

        res.render('servicos-list.ejs', { servicos });
    });
});

module.exports = router;