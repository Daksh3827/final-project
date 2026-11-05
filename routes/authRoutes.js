const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.get('/register', authController.renderRegisterPage);
authRouter.post('/register', authController.handleRegister);
authRouter.get('/login', authController.renderLoginPage);
authRouter.post('/login', authController.handleLogin);
authRouter.post('/logout', authController.handleLogout);

module.exports = authRouter;
