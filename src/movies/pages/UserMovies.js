import {React,useState,useEffect} from "react";
import { useParams,useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import MovieList from "../components/MovieList";

const UserMovies = () => {
    let history = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [movies,setMovies] = useState();
    const userId = useParams().userId;

    const deletePlace = deletePlaceId => { 
        setMovies(prevMovie => prevMovie.filter(movie => movie.id !== deletePlaceId));
        history(`/${userId}/movies`)
    }
    useEffect(() => {
        const moviesById = async () =>{     
            try{
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/movies/user/${userId}`)
                const responseData = await response.json();
                if (!response.ok){
                    throw new Error(responseData.message);
                }
                setMovies(responseData.myMovie);
                setIsLoading(false);
            }catch(err){
                setIsLoading(false);
            }
    }
    moviesById();
}, [userId])
    if (isLoading){
        return <LoadingSpinner asOverlay/>
    }
    return <MovieList items = {movies} onDelete = {deletePlace}/>
}

export default UserMovies;