const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

function isGuest(req, res, next) {
  if (req.session.userId) return res.redirect('/home');
  next();
}

function isLoggedIn(req, res, next) {
  if (!req.session.userId) return res.redirect('/users/login');
  next();
}

router.get('/home', isLoggedIn, Controller.getHome);
router.get('/register', isGuest, Controller.getRegister); 
router.post('/register', Controller.postRegister);
router.get('/login', isGuest, Controller.getLogIn);
router.post('/login', Controller.postLogIn);
router.get('/logout', isLoggedIn, Controller.logOut);

module.exports = router;
