import React, {useEffect,useState} from "react";
import axios from "axios";
import './ImdbMovie.css';
import { Button } from "react-bootstrap";

const ImdbMovie = props => {
    const [movieId, setMovieId] = useState();
    const [imdbImage, setImdbImage] = useState();
    const [imdbRating, setImdbRating] = useState();

    useEffect(()=>{
        const options = {
            method: 'GET',
            url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
            params: {q: props.title},
            headers: {
              'X-RapidAPI-Key': '71137ee64emshfaff1c5f23af3fbp13adb4jsn0192ebcd440e',
              'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
            }
          };
          const optionsRating = {
            method: 'GET',
            url: 'https://online-movie-database.p.rapidapi.com/title/get-ratings',
            params: {tconst: movieId},
            headers: {
              'X-RapidAPI-Key': '71137ee64emshfaff1c5f23af3fbp13adb4jsn0192ebcd440e',
              'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
            }
          };
    
        const getMovie = async () => {            
            await axios.request(options).then(function (response) {
                setMovieId(response.data.d[1].id);
                setImdbImage(response.data.d[1].i.imageUrl);
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