const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/create', isLoggedIn, Controller.getCreateProfile);
router.post('/create', isLoggedIn, Controller.postCreateProfile);
router.get('/edit/:id', isLoggedIn, Controller.getEditProfile);
router.post('/edit/:id', isLoggedIn, Controller.postEditProfile);
router.post('/delete/:id', isLoggedIn, Controller.deleteProfile);
router.get('/:id', isLoggedIn, Controller.getProfile);

module.exports = router;
