import React, { useEffect, useState,useContext } from "react";
import {useForm} from "../../shared/components/hooks/form-hook";
import { useParams,useNavigate } from "react-router-dom";
import Input from "../../shared/components/UIElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/components/utils/validators";
import Button from 'react-bootstrap/Button';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ModalForError from "../../shared/components/UIElements/ModalForError";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../../shared/components/context/auth-context";

const UpdateMovies = props => {
    let history = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [errorExists, setErrorExists] = useState(false);
    const [movies,setMovies] = useState();
    const movieId = useParams().movieId;
    const auth = useContext(AuthContext);

    const [formState, inputHandler,changeHandler] =  useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        review: {
          value: '',
          isValid: false
        },
        rating:{
          value: '',
          isValid: false
        }
      },
      false);

      
      useEffect(()=> {
        const getUpdateMovie =async () =>{
          try{
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_URL}/movies/${movieId}`)
            const responseData = await response.json();
            if (!response.ok){
                throw new Error(responseData.message);
            }
            setMovies(responseData.myMovie);
            changeHandler(
              {
                title:{
                  value: responseData.myMovie.name,
                  isValid: true
                },
                review: {
                  value: responseData.myMovie.review,
                  isValid: true
                },
                rating:{
                  value: responseData.myMovie.stars,
                  isValid: true
                }
              },
              true
            );
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
        }
        }
        getUpdateMovie();
      },[movieId,changeHandler]);

      const submitForm = async (event) =>{
        event.preventDefault();
          
            try{
              setIsLoading(true);
              const response = await fetch(`${process.env.REACT_APP_URL}/movies/${movieId}`,{
                  method: 'PATCH',
                  headers: {
                      'Content-Type' : 'application/json',
                      Authorization : 'Bearer ' + auth.token    
                  },
                  body: JSON.stringify({
                      name: formState.inputs.title.value,
                      review: formState.inputs.review.value,
                      stars: formState.inputs.rating.value
                  })
              })
              const responseData = await response.json();
              if (!response.ok){
                  throw new Error(responseData.message);
              }
              history("/");
              setIsLoading(false);
          }catch(err){
              setIsLoading(false);
              setErrorExists(true);
              setIsError(err.message || "There was a problem creating movie");
          } 
          setIsLoading(false);
      }

      if (isLoading) {
        return (
          <div className="center">
          <LoadingSpinner asOverlay/>
          </div>
        );
      }
      
      const errorHandler = () =>{
        setIsError(null);
        setErrorExists(false);
      }

      if (!movies || errorExists) {
        return (
          <div className="center">
            <h2>Could Not find Movies</h2>
          </div>
        );
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
          {!isLoading && movies && <form className="place-form" onSubmit={submitForm}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              value = {movies.name}
              isValid = {true}
            />
            <Input
              id="review"
              element="textarea"
              label="Review"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid Review (at least 5 characters)."
              onInput={inputHandler}
              value = {movies.review}
              isValid = {true}
            />
            <Input
              id="rating"
              element="rating"
              label="Rating"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please give a valid rating"
              onInput={inputHandler}
              value = {movies.stars}
              isValid = {true}
            />
            <Button type="submit" disabled={!formState.isValid}>
              Update Movie
            </Button>
          </form>}
        </React.Fragment>
      );
}

export default UpdateMovies