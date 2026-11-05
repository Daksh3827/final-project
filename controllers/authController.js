const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { AUTH_COOKIE, defaultCookieSettings, authCookieSettings } = require('../config/auth');

const renderRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

const handleRegister = async (req, res) => {
  const usernameInput = (req.body.username || '').trim();
  const passwordInput = req.body.password || '';

  if (!usernameInput || !passwordInput) {
    return res.status(400).render('register', { error: 'Username and password are required' });
  }

  if (usernameInput.length < 3) {
    return res.status(400).render('register', { error: 'Username must be at least 3 characters' });
  }

  if (passwordInput.length < 6) {
    return res.status(400).render('register', { error: 'Password must be at least 6 characters' });
  }

  try {
    const existingAccount = await User.findOne({ username: usernameInput });

    if (existingAccount) {
      return res.status(409).render('register', { error: 'Username is already taken' });
    }

    await User.create({ username: usernameInput, password: passwordInput });
    return res.redirect('/login');
  } catch (err) {
    return res.status(500).render('register', { error: 'Unable to register. Please try again.' });
  }
};

const renderLoginPage = (req, res) => {
  res.render('login', { error: null });
};

const handleLogin = async (req, res) => {
  const usernameInput = (req.body.username || '').trim();
  const passwordInput = req.body.password || '';

  if (!usernameInput || !passwordInput) {
    return res.status(400).render('login', { error: 'Username and password are required' });
  }

  try {
    const foundUser = await User.findOne({ username: usernameInput });
    const isPasswordValid = foundUser ? await foundUser.comparePassword(passwordInput) : false;

    if (!foundUser || !isPasswordValid) {
      return res.status(401).render('login', { error: 'Invalid username or password' });
    }

    const authToken = generateToken(foundUser);
    return res.cookie(AUTH_COOKIE, authToken, authCookieSettings).redirect('/articles');
  } catch (err) {
    return res.status(500).render('login', { error: 'Unable to log in. Please try again.' });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie(AUTH_COOKIE, defaultCookieSettings);
  res.redirect('/login');
};

module.exports = {
  renderRegisterPage,
  handleRegister,
  renderLoginPage,
  handleLogin,
  handleLogout,
  showRegister: renderRegisterPage,
  register: handleRegister,
  showLogin: renderLoginPage,
  login: handleLogin,
  logout: handleLogout
};
