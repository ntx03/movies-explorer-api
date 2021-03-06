const rateLimit = require('express-rate-limit');

// лимитируем запросы на сервер
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте повторить попытку позже',
});

module.exports = limiter;
