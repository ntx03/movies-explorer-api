const router = require('express').Router();
const { updateProfileUserValidation } = require('../middlewares/validation');
const { getUser, updateProfileUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/users/me', getUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/users/me', updateProfileUserValidation, updateProfileUser);

module.exports = router;
