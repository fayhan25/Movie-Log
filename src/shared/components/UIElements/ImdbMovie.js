import React, {useEffect,useState} from "react";
import axios from "axios";
import './ImdbMovie.css';
import { Button } from "react-bootstrap";

const ImdbMovie = props => {
    const [movieId, setMovieId] = useState();
    const [imdbImage, setImdbImage] = useState();
    const [imdbRating, setImdbRating] = useState();
    const [imdbStars, setImdbStars] = useState();
    useEffect(()=>{
        const options = {
            method: 'GET',
            url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
            params: {q: props.title},
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
              'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
            }
          };
          const optionsRating = {
            method: 'GET',
            url: 'https://online-movie-database.p.rapidapi.com/title/get-ratings',
            params: {tconst: movieId},
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
              'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
            }
          };
    
        const getMovie = async () => {            
            await axios.request(options).then(function (response) {
                setMovieId(response.data.d[0].id);
                setImdbImage(response.data.d[0].i.imageUrl);
                setImdbStars(response.data.d[0].s)
            }).catch(function (error) {
            console.error(error);
            });}
            
            getMovie();
            
            const getRating = async () => {
                await axios.request(optionsRating).then(function (response) {
                    setImdbRating(response.data.rating);
                }).catch(function (error) {
                    console.error(error);
            })}; 
            getRating();
        
    }, [imdbImage, imdbRating, movieId,props.title])

    return (
        <div className="imdb-main">
            <img 
                src = {imdbImage}
                 alt = {props.title}     
            />

            <div className="imdb-main_info">
                <h5>
                    Stars : {imdbStars}
                </h5>
                <h5>
                    User Rating : {imdbRating}
                </h5>
            </div>


            <a className = "imdb-main__page" 
                href={`https://www.imdb.com/title/${movieId}`} 
                target="_blank" rel="noreferrer">
                <Button>Imdb Website</Button>  
            </a>
        </div>
    )
}

export default ImdbMovie