const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const {validationResult } = require('express-validator');
const Movie = require('../models/movies');
const User = require('../models/users');
const { default: mongoose } = require('mongoose');
const getMovieById = (async (req, res, next) => {
    const myId = req.params.mid;
    let myMovie;
    try {
        myMovie = await Movie.findById(myId)
    }catch (err){
        const error = new Error("a movie was not found by this movie id");
        error.code = 404;
        return next(error)
    }
    
    if (!myMovie){
        const error = new Error("a movie was not found");
        error.code = 404;
        return next(error);
    }
    res.json({myMovie :myMovie.toObject( {getters: true})})
});

const getMovieByUserId = (async (req, res, next) => {
    const myId = req.params.uid;
    let myMovie;
    try {
        myMovie = await Movie.find({creator:myId})
    }catch (err){
        const error = new Error("a movie was not found by this user id");
        error.code = 404;
        return next(error)
    }
    if (!myMovie){
        const error = new Error("a movie was not found for this user");
        error.code = 404;
        return next(error);
    }
    res.json({myMovie :myMovie.map(movie=>movie.toObject( {getters: true}))})
});

const createMovie = async (req,res,next)=> {
    const error = validationResult(req);
    if (!error.isEmpty()){
        const error = new Error("missing fields");
        error.code = 422;
        return next(error);
    }

    const { name, review, stars} = req.body

    const newMovie = new Movie( {
        name,
        review,
        stars,
        image: req.file.path,
        creator : req.userData.userId
    })
     
    let user;

    try{
        user = await User.findById(req.userData.userId);
    }
    catch(err){
        const error = new Error("could not find user");
        error.code = 422;
        return next(error);
    }
    try {
        await newMovie.save()
        user.movies.push(newMovie);
        await user.save();
    } catch(err){
        const error = new Error("missing fields");
        error.code = 422;
        return next(error);
    }
    res.json(newMovie);  
};

const patchMovie = async (req,res,next) =>{
    const myId = req.params.mid;
    let movieToPatch;
    try{
        movieToPatch = await Movie.findById(myId);
    }catch(err){
        const error = new Error("Could not update");
        error.code = 422;
        return next(error);
    }

    if (movieToPatch.creator.toString() !== req.userData.userId){
        const error = new Error(" Not Authorized");
        error.code = 401;
        return next(error);
    }
   
    if (req.body.name) movieToPatch.name = req.body.name;
    if (req.body.review) movieToPatch.review = req.body.review;
    if (req.body.stars) movieToPatch.stars = req.body.stars;

    try {await movieToPatch.save();}
    catch(err){
        const error = new Error("Could not save movie");
        error.code = 422;
        return next(error);
    }

    res.status(201).json({movieToPatch: movieToPatch.toObject({getters: true})});
}

const deleteMovie = async (req,res,next)=>{
    const myId = req.params.mid;

    let movie;
    try{
        movie = await Movie.findByIdAndDelete(myId).populate('creator');
    } catch(err){
        const error = new Error("Could not find movie with the id");
        error.code = 422;
        return next(error);
    } 

    if (movie.creator.id !== req.userData.userId){
        const error = new Error(" Not Authorized to delete");
        error.code = 401;
        return next(error);
    }

    let moviePath = movie.image
    try{
        await movie.creator.movies.pull(movie);
        await movie.creator.save();
    } catch(err){
        const error = new Error("Could not delete from user");
        error.code = 422;
        return next(error);
    } 

    fs.unlink(moviePath, err => {
        console.log(err);
    })
    res.status(200).json({message: "Sucessfully deleted"});
}

exports.getMovieById = getMovieById;
exports.getMovieByUserId = getMovieByUserId;
exports.createMovie = createMovie;
exports.patchMovie = patchMovie;
exports.deleteMovie = deleteMovie;