const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/BadRequest');

// валидируем URL
const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

// валидируем создание пользователя
const createUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// !!валидируем обновление профиля пользователя
const updateProfileUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// !!валидируем добавление фильма
const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationUrl),
    trailerLink: Joi.string().required().custom(validationUrl),
    thumbnail: Joi.string().required().custom(validationUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

// валидиуем почту и пароль
const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  createMovieValidation,
  updateProfileUserValidation,
  validationLogin,
  createUserValid,
};
