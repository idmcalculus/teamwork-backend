const express = require('express');
const UserController = require('../controllers/user');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');

const router = express.Router();

router.post('/auth/users', isAdmin, UserController.createUserAccount);

router.post('/auth/login', UserController.loginUser);

router.get('/auth/users', auth, UserController.getAllUsers)

module.exports = router;