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

// достаем адрес базы данных
const { ADRESS_DATA_BASE, NODE_ENV } = process.env;
// создаем сервер на фреймворке express
const app = express();

// подключаемся к базе данных MongoDB
mongoose.connect(NODE_ENV === 'production' ? ADRESS_DATA_BASE : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
// подключаем Cors
app.use(cors());

// настраиваем заголовки
app.use(helmet());

// логгер запросов на сервер
app.use(requestLogger);

// ограничиваем количество запросов на сервер
app.use(limiter);

// преобразование в строку
app.use(express.json());

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
