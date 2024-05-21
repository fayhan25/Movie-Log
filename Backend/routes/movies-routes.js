const express = require('express');
const fileUpload = require('../middleware/file-upload')
const router = express.Router();

const { check } = require('express-validator');

const getMovies = require('../contollers/movies-controller')
const checkAuth = require('../middleware/check-auth')

router.get("/:mid", getMovies.getMovieById );

router.get("/user/:uid", getMovies.getMovieByUserId );

router.use(checkAuth);

router.post("/", 
    fileUpload.single('image'),
[    check('name').not().isEmpty(), 
    check('review').isLength({min: 5}), 
    check('stars').not().isEmpty()],
    getMovies.createMovie);

router.patch("/:mid", 
    check('name').not().isEmpty(), 
    check('review').isLength({min: 5}), 
    check('stars').not().isEmpty(),
    getMovies.patchMovie);

router.delete("/:mid", getMovies.deleteMovie);

module.exports = router;