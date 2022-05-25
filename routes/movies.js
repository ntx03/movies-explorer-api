const router = require('express').Router();

const { allMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation } = require('../middlewares/validation');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', allMovies);

// создаёт фильм с переданными в теле
router.post('/movies', createMovieValidation, createMovie);

// удаляет фильм по id
router.delete('/movies/:_id', deleteMovie);

module.exports = router;
