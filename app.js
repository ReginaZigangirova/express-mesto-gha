const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '628494b68b747bd239586344', //  _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.listen(PORT);
