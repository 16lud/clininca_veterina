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
    res.redirect('/animais');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
