const Article = require('../models/Article');
const User = require('../models/User');

const getAllArticles = async (req, res) => {
  const allPosts = await Article.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  res.render('articleList', { articles: allPosts, author: null });
};

const getUserArticles = async (req, res) => {
  const accountDetails = await User.findById(req.user.id).populate({
    path: 'articles',
    options: { sort: { createdAt: -1 } }
  });

  if (!accountDetails) {
    return res.redirect('/login');
  }

  res.render('myArticles', { articles: accountDetails.articles });
};

const renderCreateForm = (req, res) => {
  res.render('articleForm', {
    article: null,
    formAction: '/articles',
    values: { title: '', content: '' },
    error: null
  });
};

const publishArticle = async (req, res) => {
  const postTitle = (req.body.title || '').trim();
  const postContent = (req.body.content || '').trim();

  if (!postTitle || !postContent) {
    return res.status(400).render('articleForm', {
      article: null,
      formAction: '/articles',
      values: { title: postTitle, content: postContent },
      error: 'Title and content are required'
    });
  }

  const newPost = await Article.create({ title: postTitle, content: postContent, author: req.user.id });
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { articles: newPost._id } });

  return res.redirect('/articles/my');
};

const getArticleById = async (req, res) => {
  const targetPost = await Article.findById(req.params.id).populate('author', 'username role');

  if (!targetPost) {
    return res.status(404).send('Article not found');
  }

  res.render('articleItem', { article: targetPost, comments: [] });
};

const renderEditForm = async (req, res) => {
  const targetPost = await Article.findById(req.params.id);

  if (!targetPost) {
    return res.status(404).send('Article not found');
  }

  const isPublisher = targetPost.author.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isPublisher && !isAdmin) {
    return res.status(403).send('Access denied: You can only edit your own articles');
  }

  res.render('articleForm', {
    article: targetPost,
    formAction: `/articles/${targetPost._id}/edit`,
    values: { title: targetPost.title, content: targetPost.content },
    error: null
  });
};

const updateArticle = async (req, res) => {
  const targetPost = await Article.findById(req.params.id);

  if (!targetPost) {
    return res.status(404).send('Article not found');
  }

  const isPublisher = targetPost.author.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isPublisher && !isAdmin) {
    return res.status(403).send('Access denied: You can only edit your own articles');
  }

  const postTitle = (req.body.title || '').trim();
  const postContent = (req.body.content || '').trim();

  if (!postTitle || !postContent) {
    return res.status(400).render('articleForm', {
      article: targetPost,
      formAction: `/articles/${targetPost._id}/edit`,
      values: { title: postTitle, content: postContent },
      error: 'Title and content are required'
    });
  }

  targetPost.title = postTitle;
  targetPost.content = postContent;
  await targetPost.save();

  return res.redirect(`/articles/${targetPost._id}`);
};

const removeArticle = async (req, res) => {
  const targetPost = await Article.findById(req.params.id);

  if (!targetPost) {
    return res.status(404).send('Article not found');
  }

  const isPublisher = targetPost.author.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isPublisher && !isAdmin) {
    return res.status(403).send('Access denied: You can only delete your own articles');
  }

  await Article.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(targetPost.author, { $pull: { articles: targetPost._id } });

  return res.redirect('/articles/my');
};

module.exports = {
  getAllArticles,
  getUserArticles,
  renderCreateForm,
  publishArticle,
  getArticleById,
  renderEditForm,
  updateArticle,
  removeArticle,
  list: getAllArticles,
  myArticles: getUserArticles,
  showNewForm: renderCreateForm,
  create: publishArticle,
  show: getArticleById,
  showEditForm: renderEditForm,
  update: updateArticle,
  deleteArticle: removeArticle
};
