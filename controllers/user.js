const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const InvalidRequest = require('../errors/InvalidRequest');
const AuthError = require('../errors/AuthError');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
// создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200)
      .send({
        data: {
          name,
          about,
          avatar,
          email,
        },
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequest('не передан email или пароль'));
        return;
      }
      if (err.code === 11000) {
        next(new Conflict('такой email уже занят'));
        return;
      }
      next(err);
    });
};

// логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      if (!email || !password) {
        next(new AuthError('некорректный email или пароль'));
      }
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      }).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
// возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
// возвращает всех пользователей
const getUsers = (_, res, next) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// возвращает пользователя по _id
const getUser = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFound('пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new InvalidRequest('некорректный id при создании пользователя'));
        return;
      }
      next(err);
    });
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        next(new NotFound('пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequest('переданы некорректные данные при создании пользователя'));
        return;
      }
      next(err);
    });
};

// обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        next(new NotFound('пользователь по указанному id не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequest('переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
