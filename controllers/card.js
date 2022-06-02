const Card = require('../models/card');
const InvalidRequest = require('../errors/InvalidRequest');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

// создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequest('переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('карточка не найдена');
      }
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.send({ data: card });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new InvalidRequest('некорректный id'));
              return;
            }
            next(err);
          });
        return;
      }
      throw new ForbiddenError('невозможно удалить карту других пользователей');
    })
    .catch((err) => next(err));
};

// лайк
const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('передан несуществующий id карточки'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequest('некорректный id'));
        return;
      }
      next(err);
    });
};

// дизлайк
const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('передан несуществующий id карточки'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequest('некорректный id'));
        return;
      }
      next(err);
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
