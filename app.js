const express = require('express');
const mongoose = require('mongoose');

const { createUser } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mydb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '628494b68b747bd239586344', //  _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.post('/signup', createUser);
app.use((_, res) => {
  res.status(404).send({ message: 'Страница с таким url не найдена' });
});
app.listen(PORT);
