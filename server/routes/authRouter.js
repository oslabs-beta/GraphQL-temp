const express = require('express');
const authRouter = express.Router();

const userController = require('../controllers/userController.js');

// signup route
authRouter.post(
  '/signup',
  userController.hashing,
  userController.createUser,
  userController.signJWT,
  (req, res) => {
    // console.log('Reached /api/auth/signup');
    return res.status(200).json(res.locals.user);
  }
);

// login route
authRouter.post(
  '/login',
  userController.loginUser,
  userController.signJWT,
  (req, res) => {
    // console.log('Reached /api/auth/login');
    return res.status(200).json(res.locals.user);
  }
);

authRouter.post(
  '/protected',
  userController.validateJWT,
  userController.signJWT,
  (req, res) => {
    // console.log('Reached /api/auth/protected');
    // success - valid token
    return res.status(200).json(res.locals.user);
  }
);

module.exports = authRouter;
