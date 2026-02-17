const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const { isLoggedIn } = require('../middlewares/auth')

router.get('/create', isLoggedIn, Controller.getCreatePost)
router.post('/create', isLoggedIn, Controller.postCreatePost)
router.get('/edit/:id', isLoggedIn, Controller.getEditPost)
router.post('/edit/:id', isLoggedIn, Controller.postEditPost)
router.get('/delete/:id', isLoggedIn, Controller.deletePost)

module.exports = router