const express = require('express')

const router = express.Router()

const userControllers = require('../controllers/user-controller')

router.get('/all',userControllers.allUsers)
router.get('/:userId',userControllers.getUserById)
router.post('/sign-up',userControllers.signUp)
router.post('/login',userControllers.login)

module.exports = router