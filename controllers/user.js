const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/auth-err.js');
const ConflictError = require('../errors/conflict-err.js');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new AuthError('Необходима авторизация');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.register = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        res.status(201).send({
          name: user.name,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          const error = new ConflictError('Пользователь с данным email уже существует');

          next(error);
        }

        next(err);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return res.send({
            token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
          });
        })
        .catch(next);
    })
    .catch(next);
};
