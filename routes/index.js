const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

const userRouter = require('./users')
const profilesRouter = require('./profiles')
const postsRouter = require('./posts')
const interactionsRouter = require('./interactions')

router.get('/', Controller.home)
router.get('/home', Controller.getHome)
router.get('/logout', Controller.logOut)

router.use('/users', userRouter)
router.use('/profiles', profilesRouter)
router.use('/posts', postsRouter)
router.use('/interactions', interactionsRouter)

module.exports = router
