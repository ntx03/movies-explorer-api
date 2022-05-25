const Movies = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

//  Возвращает все сохранённые текущим  пользователем фильмы;
const allMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// Добавляем фильм;
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    // eslint-disable-next-line no-shadow
    .then((movie) => res.status(200).send({ movie }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Такой фильм  уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при добавлении фильма!'));
      } else {
        next(err);
      }
    });
};

// удаляем сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movies.findById(_id).orFail(() => { throw new NotFound('Фильм не найден'); })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movies.findByIdAndRemove(_id)
          .then((item) => { res.status(200).send(item); });
      }
      throw new Forbidden('В доступе отказано');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Фильм с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  allMovies,
  createMovie,
  deleteMovie,
};
