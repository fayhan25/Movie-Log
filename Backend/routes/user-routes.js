const express = require('express');

const router = express.Router();

const users = require('../contollers/users-controller');
const fileUpload = require('../middleware/file-upload')
const { check } = require('express-validator');

router.get("/", users.getUsers);

router.post("/signup",    
    fileUpload.single('image'),
    [check('email').normalizeEmail().isEmail(),
    check('password').exists().isLength({min:5}),
    check('name').exists()
    ], users.signUpUser);

router.post("/login", users.loginUser);

module.exports = router;