const express = require('express');
const authController = require('../../controllers/auth.controller');
const { validateRefreshToken } = require('../../services/auth.service');

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refreshToken', validateRefreshToken, authController.refreshAccessToken);

module.exports = router;
