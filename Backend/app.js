const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const moviesRouter = require('./routes/movies-routes');
const userRouter = require('./routes/user-routes');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });
app.use("/api/movies",moviesRouter);

app.use("/api/users", userRouter);

app.use((error,req,res,next) => {
    if (req.file){
        fs.unlink(req.file.path, err => {
            console.log(err);
        })
    }
    if (res.headerSent){
        return next(error);
    }

    res.status(error.code||500);
    res.json({message: error.message || "An unknown error has occured"})
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.meczrka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => 
    {
        app.listen(process.env.PORT || 5000)
    })
    .catch(error => {
        {console.log(error)}
    })