const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getUsers); // возвращает всех пользователей
router.get('/:userId', getUser); // возвращает пользователя по _id
router.patch('/me', updateUser); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
