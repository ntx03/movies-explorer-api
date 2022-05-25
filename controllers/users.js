const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const SALT_ROUNDS = 10;

// создаем пользователя
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ email, name, password: hash }))
    // eslint-disable-next-line no-shadow
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя!.'));
      } else {
        next(err);
      }
    });
};

// получаем информацию о текущем пользователе
const getUser = (req, res, next) => {
  User.findById(req.user._id).orFail(() => { throw new NotFound('Пользователь не найден'); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else { next(err); }
    });
};

// обновляем данные пользователя имя и email
const updateProfileUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound('Пользователь с указанным _id не найден'); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else { next(err); }
    });
};

// проходим авторизацию
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateProfileUser,
  login,
  getUser,
};
