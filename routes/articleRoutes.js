const express = require('express');
const articleRouter = express.Router();
const articleController = require('../controllers/articleController');
const { checkAuth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

articleRouter.get('/articles', articleController.getAllArticles);
articleRouter.get('/articles/my', checkAuth, articleController.getUserArticles);
articleRouter.get('/articles/new', checkAuth, allowRoles('user', 'admin'), articleController.renderCreateForm);
articleRouter.post('/articles', checkAuth, allowRoles('user', 'admin'), articleController.publishArticle);
articleRouter.get('/articles/:id', articleController.getArticleById);
articleRouter.get('/articles/:id/edit', checkAuth, articleController.renderEditForm);
articleRouter.post('/articles/:id/edit', checkAuth, articleController.updateArticle);
articleRouter.post('/articles/:id/delete', checkAuth, articleController.removeArticle);

module.exports = articleRouter;
