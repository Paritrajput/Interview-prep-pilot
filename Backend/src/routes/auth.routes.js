const express = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

//routes post/api/auth/register
//description register a user
//access public

authRouter.post('/register', authController.registerUserController);

//routes post/api/auth/login
//description login a user with email and password
//access public
authRouter.post('/login', authController.loginUserController);

//routes get/api/auth/logout
//description logout a user by blacklisting the token
//access public
authRouter.get('/logout', authController.logoutUserController);

//routes get/api/auth/get-me
//description get the details of the logged in user
//access private
authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;