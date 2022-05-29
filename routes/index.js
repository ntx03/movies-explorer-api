const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../errors/NotFound');
const { validationLogin, createUserValid } = require('../middlewares/validation');
const {
  login, createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', validationLogin, login);
router.post('/signup', createUserValid, createUser);
router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);

router.use((req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;
