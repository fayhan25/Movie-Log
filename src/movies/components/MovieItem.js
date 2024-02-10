import React, {useState,useContext} from "react";

import Card from "../../shared/components/UIElements/Card"
import { Button } from "react-bootstrap";
import './MovieItem.css';
import Modal from "../../shared/components/UIElements/Modal"
import { Link } from "react-router-dom";
import ImdbMovie from "../../shared/components/UIElements/ImdbMovie";
import { AuthContext } from "../../shared/components/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ModalForError from "../../shared/components/UIElements/ModalForError";
import Rating from '@mui/material/Rating';

const MovieItem = props => {
    const [showImdb, setShowImdb] = useState(true);
    const [showDelete, setShowDelete] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [errorExists, setErrorExists] = useState(false);


    const auth = useContext(AuthContext);
    const openImdbModal = () => {
        setShowImdb(true);
    }
    const closeImdbModal = () => {
        setShowImdb(false);
    }

    const openDeleteModal = () => {
        setShowDelete(true);
    }

    const closeDeleteModal = () => {
        setShowDelete(false)
    }

    const deleteItem = async () => {
        setShowDelete(false);
        try{
            setIsLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/movies/${props.id}`,{
                 method: 'DELETE',
                 headers: {Authorization : 'Bearer ' + auth.token}
                },                 
                 );
            const responseData = await response.json();
            if (!response.ok){
                throw new Error(responseData.message);
            }
            props.onDelete(props.id);
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
        }
    }

    if (isLoading){
        return <LoadingSpinner asOverlay/>
    }

        
    const errorHandler = () =>{
        setIsError(null);
        setErrorExists(false);
      }

    return (
        <React.Fragment>
            {errorExists && <ModalForError
                id = "errorModalTarget" 
                ariaLabel="errorModalTargetLabel" 
                title = "There Was an error" 
                body = {isError}
                onClick = {errorHandler}
            />}
            {showDelete && 
            <Modal 
                id = "deleteModalTarget" 
                ariaLabel="deleteModalTargetLabel" 
                title = "Are you Sure?" 
                onClick = {closeDeleteModal} 
                body = "This Item Will be Deleted if You Proceed"
                deleteModal = {showDelete}
                onClickDelete = {deleteItem}
            />}

            {showImdb && 
            <Modal 
                title = {props.name} 
                onClick = {closeImdbModal}
                id = "exampleModal" 
                ariaLabel="exampleModalLabel" 
                body = {<ImdbMovie title = {props.name}/>}
            />}

            <li className="movie-item">
                <Card className="movie-item__content" >
                        <img className = "card-image" src = {`http://localhost:5000/${props.image}`} alt = {props.name}/>
                        <div  className= "movie-item__info" >
                            <h2>{props.name}</h2>
                            <p>{props.review}</p>
                            <Rating name = "half-rating-read" value={props.stars} readOnly/>
                        </div>
                        <div className="movie-item__actions">
                            <Button className="btn-info" onClick={openImdbModal} data-bs-toggle="modal" data-bs-target="#exampleModal"> VIEW ON IMDB</Button>
                            {auth.userId === props.creator && <Button> <Link to ={`/movies/${props.id}`} style={{textDecoration:'none', color: '#fff'}}>EDIT</Link></Button>}
                            {auth.userId === props.creator && <Button className="btn-danger" onClick = {openDeleteModal} data-bs-toggle="modal" data-bs-target="#deleteModalTarget">DELETE</Button>}
                        </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default MovieItem;