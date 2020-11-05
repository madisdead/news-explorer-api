const Article = require('../models/article');
const ServerError = require('../errors/server-err.js');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err.js');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      res.send(articles);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const id = req.user._id;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: id,
  })
    .then((article) => {
      res.status(201).send(article);
    })
    .catch(next);
};

module.exports.removeArticle = (req, res, next) => {
  Article.findOne({ _id: req.params.id })
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Карточка не найдена');
      }
      Article.find({ owner: req.user._id })
        .then((articles) => {
          const card = articles.find((item) => String(item._id) === req.params.id);
          if (!card) {
            throw new ForbiddenError('Нельзя удалить не свою карточку');
          }
          Article.findByIdAndRemove(card._id)
            .then((result) => {
              if (!result) {
                throw new ServerError('Произошла ошибка');
              }
              res.send(card);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};
