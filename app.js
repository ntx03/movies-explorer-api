require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');
const serverError = require('./middlewares/serverError');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// создаем сервер на фреймворке express
const app = express();

// подключаемся к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
// подключаем Cors
app.use(cors());

// настраиваем заголовки
app.use(helmet());

// ограничиваем количество запросов на сервер
app.use(limiter);

// преобразование в строку
app.use(express.json());

// логгер запросов на сервер
app.use(requestLogger);

// подключаем роуты
app.use(router);

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// eslint-disable-next-line no-unused-vars
// обрататываем общие ошибки
app.use(serverError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
