const express = require('express');
const { signup, signin, signout, getuser } = require('../controller/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const { requireSignin } = require('../middleware');
const router = express.Router();


router.post('/signup',validateSignupRequest, isRequestValidated, signup);
router.post('/signin',validateSigninRequest, isRequestValidated, signin);
router.post('/signout', signout)
router.get('/user', requireSignin, getuser)

module.exports = router;