const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, Controller.getCreatePost);
router.post('/', isLoggedIn, Controller.postCreatePost);
router.get('/edit/:id', isLoggedIn, Controller.getEditPost);
router.post('/edit/:id', isLoggedIn, Controller.postEditPost);
router.post('/delete/:id', isLoggedIn, Controller.deletePost);

module.exports = router;
