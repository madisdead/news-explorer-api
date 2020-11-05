const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routerUsers = require('./users.js');
const routerArticles = require('./articles.js');
const auth = require('../middlewares/auth.js');
const { register, login } = require('../controllers/user.js');
const NotFoundError = require('../errors/not-found-err.js');

router.use('/users', auth, routerUsers);
router.use('/articles', auth, routerArticles);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required().min(6),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required().min(6).pattern(/[0-9a-zA-Z!@#$%^&*]{6,}/),
    name: Joi.string().required().min(2).max(30),
  }),
}), register);

router.use('*', (req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');

  next(error);
});

module.exports = router;
