const bcrypt = require('bcryptjs');
const User = require('../models/user');
// создаёт пользователя
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'не передан email или пароль' });
    return;
  }
  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then(() => res.status(200).send({ message: 'пользователь создан' }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'такой email уже занят' });
      }
      return res.status(500).send({ message: 'ошибка по умолчанию' });
    }));
};

// возвращает всех пользователей
const getUsers = (_, res) => {
  User.find({})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// возвращает пользователя по _id
const getUser = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Некорректный id при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет профиль
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
