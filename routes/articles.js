const routerArticles = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getArticles, createArticle, removeArticle,
} = require('../controllers/article');

routerArticles.get('/', getArticles);

routerArticles.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().min(2).pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
    image: Joi.string().required().min(2).pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
  }),
}), createArticle);

routerArticles.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), removeArticle);

module.exports = routerArticles;
