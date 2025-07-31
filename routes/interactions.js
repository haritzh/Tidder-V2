const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const { isLoggedIn } = require('../middlewares/auth');

router.post('/upvote/:postId', isLoggedIn, Controller.upVotePost);
router.post('/downvote/:postId', isLoggedIn, Controller.downVotePost);
router.post('/comment/:postId', isLoggedIn, Controller.commentPost);

module.exports = router;
