var express = require('express')
var router = express.Router()

let usersController = require('../controllers/usersController')


router.get('/', usersController.index)

router.get('/employed', usersController.employed)

router.get('/unemployed', usersController.unemployed)

router.get('/login', usersController.loginForm)

router.post('/login', usersController.login)

router.get('/register', usersController.new)

router.post('/register', usersController.create)

router.get('/user/:username', usersController.show)

router.get('/user/edit/:username', usersController.edit)
router.post('/user/edit', usersController.update)
router.post('/logout', usersController.logout)

module.exports = router