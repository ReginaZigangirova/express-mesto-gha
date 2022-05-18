const router = require('express').Router();

const {
    getCards,
    createCard,
    deleteCard,
    addLike,
    removeLike,
} = require('../controllers/card');

router.get('/', getCards); // возвращает все карточки
router.post('/', createCard); // создаёт карточку
router.delete('/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/:cardId/like', addLike); // поставить лайк карточке
router.delete('/:cardId/likes', removeLike); // убрать лайк с карточки

module.exports = router;