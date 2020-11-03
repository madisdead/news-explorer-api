const routerUsers = require('express').Router();
const { getUser } = require('../controllers/user');

routerUsers.get('/me', getUser);

module.exports = routerUsers;
