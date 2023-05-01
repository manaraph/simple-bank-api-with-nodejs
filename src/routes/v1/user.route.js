const express = require('express');
const userController = require('../../controllers/user.controller');
const { authorizeAdmin, authenticateUser } = require('../../services/auth.service');

const router = express.Router();

router.get('/users/', authorizeAdmin, userController.getUsers);
router.get('/user/:userId', authenticateUser, userController.getUser);

module.exports = router;
