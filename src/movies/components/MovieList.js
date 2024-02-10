import React from "react";

import MovieItem from './MovieItem';

import './MovieList.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MovieList = props => {
    if (!props.items){
        return (
            <div>
                <h1> No Movie Reviews Found Please try again.</h1>
                <Button ><Link to = "/movies/new" style={{textDecoration:'none', color: '#fff'}}> Add Review</Link></Button>
            </div>
        )
    }

    return(
        <ul className="movie-list">
            {props.items.map(movies => <MovieItem
                key = {movies.id}
                id = {movies.id}
                image = {movies.image}
                name = {movies.name}
                review = {movies.review}
                stars = {movies.stars}
                creator = {movies.creator}
                onDelete = {props.onDelete}
            />)}
        </ul>
    )
}

export default MovieList;