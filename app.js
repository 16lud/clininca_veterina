const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const donosRoutes = require('./routes/donos');
const animaisRoutes = require('./routes/animais');
const veterinariosRoutes = require('./routes/veterinarios');

app.use('/donos', donosRoutes);
app.use('/animais', animaisRoutes);
app.use('/veterinarios', veterinariosRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
app.post('/animais/excluir/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM animais WHERE id_animal = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.send('Erro ao excluir animal');
        }
        res.redirect('/animais');
    });
});
app.post('/animais/editar/:id', (req, res) => {
    const id = req.params.id;
    const { nome, idade, especie, raca } = req.body;

    const sql = `
        UPDATE animais 
        SET nome = ?, idade = ?, especie = ?, raca = ?
        WHERE id_animal = ?
    `;

    db.query(sql, [nome, idade, especie, raca, id], (err) => {
        if (err) throw err;
        res.redirect('/animais');
    });
});
app.post('/donos/excluir/:id', (req, res) => {
    const sql = 'DELETE FROM donos WHERE id_dono = ?';

    db.query(sql, [req.params.id], err => {
        if (err) throw err;
        res.redirect('/donos');
    });
});
app.get('/donos/editar/:id', (req, res) => {
    db.query(
        'SELECT * FROM donos WHERE id_dono = ?',
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            res.render('editar_dono', { dono: result[0] });
        }
    );
});

app.post('/donos/editar/:id', (req, res) => {
    const { nome, cpf } = req.body;

    db.query(
        'UPDATE donos SET nome = ?, cpf = ? WHERE id_dono = ?',
        [nome, cpf, req.params.id],
        err => {
            if (err) throw err;
            res.redirect('/donos');
        }
    );
});
