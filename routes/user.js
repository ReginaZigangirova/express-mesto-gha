const router = require('express').Router();

const {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/user');

router.get('/', getUsers); // возвращает всех пользователей
router.get('/:userId', getUser); // возвращает пользователя по _id
router.post('/', createUser); // создаёт пользователя
router.patch('/me', updateProfile); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;