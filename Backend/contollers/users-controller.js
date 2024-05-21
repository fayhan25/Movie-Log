const User = require('../models/users')
const {validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUsers = async (req,res,next)=>{
    let allUsers
    try{
        allUsers = await User.find({}, "-password");
    } 
    catch(err){
        const error = new Error("could not access Users");
        error.code = 422;
        return next(error);
    }

    res.json({allUsers: allUsers.map(user=> user.toObject({getters:true}))});
}

const signUpUser = async (req,res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        const error = new Error("could not signup");
        error.code = 422;
        return next(error);
    }

    const {name, email,password} = req.body;
    
    let hasUser;

    try {
        hasUser = await User.findOne({ email: email});
    }
    catch(err){
        const error = new Error("Problem Signing in");
        error.code = 422;
        return next(error);
    }
    if (hasUser){
        const error = new Error("a user already singed up with these credentials");
        error.code = 404;
        return next(error);
    }

    let hashedPassword;

    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        const error = new Error("Could not hash the password please try again");
        error.code = 404;
        return next(error);
    }

    const newUser = new User( {
        name,
        email,
        password: hashedPassword,
        image:req.file.path,
        movies: []
    });

    try {
        await newUser.save()
    } catch(err){
        const error = new Error("missing fields");
        error.code = 422;
        return next(error);
    }

    let token
    try{
        token = jwt.sign(
            {userId: newUser.id, email: newUser.email},
            process.env.JWT_TOKEN,
            {expiresIn:'1h'});
    }catch(err){
        const error = new Error("Please try again");
        error.code = 404;
        return next(error);
    }
    res.status(201).json({userId: newUser.id, email: newUser.email, token:token});
}

const loginUser = async (req,res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        const error = new Error("could not login");
        error.code = 422;
        return next(error);
    }

    const {email, password} = req.body;

    let logUser;

    try{
        logUser = await User.findOne({email: email});
    }
    catch(err){
        const error = new Error("could not find user");
        error.code = 422;
        return next(error);   
    }

    if(!logUser) {
        const error = new Error("a user was not found with these credentials");
        error.code = 404;
        return next(error);
    }

    let isValidPassword = false;

    try{
        isValidPassword = await bcrypt.compare(password, logUser.password);        
    }catch(err){
        const error = new Error("passwords do not match");
        error.code = 404;
        return next(error);
    }

    if (!isValidPassword){
        const error = new Error("a user was not found with these credentials after bcrypt");
        error.code = 404;
        return next(error);
    }

    let token
    try{
        token = jwt.sign(
            {userId: logUser.id, email: logUser.email},
            process.env.JWT_TOKEN,
            {expiresIn:'1h'});
    }catch(err){
        const error = new Error("Please try again");
        error.code = 404;
        return next(error);
    }

    res.status(201).json({userId: logUser.id, email: logUser.email, token:token});
}
exports.getUsers = getUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;