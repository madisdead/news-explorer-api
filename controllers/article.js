const Article = require('../models/article');
const RequestError = require('../errors/request-err.js');
const ServerError = require('../errors/server-err.js');
const NotFoundError = require('../errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (!articles) {
        throw new ServerError('Произошла ошибка');
      }
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
      if (!article) {
        throw new RequestError('Некорректные данные');
      }

      res.status(201).send(article);
    })
    .catch(next);
};

module.exports.removeArticle = (req, res, next) => {
  Article.findOne({ _id: req.params.id, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Невозможно удалить карточку');
      }
      Article.findByIdAndRemove(article._id)
        .then((result) => {
          if (!result) {
            throw new ServerError('Произошла ошибка');
          }
          res.send(article);
        })
        .catch(next);
    })
    .catch(next);
};
