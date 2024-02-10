import React from "react";
import {useContext,useState} from "react";
import { useNavigate } from 'react-router-dom';
import Input from "../../shared/components/UIElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/utils/validators";
import './Movies.css'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useForm} from "../../shared/components/hooks/form-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ModalForError from "../../shared/components/UIElements/ModalForError";
import ImageUpload from "../../shared/components/UIElements/ImageUpload";


  const Movies = () => {
    let history = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [errorExists, setErrorExists] = useState(false);
    const auth = useContext(AuthContext);

    const inputs = {
      title: {
        value: '',
        isValid: false
      },
      review: {
        value: '',
        isValid: false
      },
      rating:{
        value: 0,
        isValid: false
      },
      image:{
        value:null,
        isValid: false
      }
    }
    const [formState, inputHandler] =  useForm(inputs, false);
  
    const submitForm = async (event) =>{
      event.preventDefault();
      try{
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name',formState.inputs.title.value );
        formData.append('review',formState.inputs.review.value );
        formData.append('stars',formState.inputs.rating.value );
        formData.append('image',formState.inputs.image.value );
        
        const response = await fetch('http://localhost:5000/api/movies',{
            method: 'POST',
            headers: {
              Authorization : 'Bearer ' + auth.token
            },
            body: formData,

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
      {isLoading && <LoadingSpinner asOverLay/> }
      <form className="place-form" onSubmit = {submitForm}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="review"
          element="textarea"
          label="Review"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Review (at least 5 characters)."
          onInput={inputHandler}
        />
        <ImageUpload id = "image" onInput = {inputHandler}/>
        <Input
          id="rating"
          element="rating"
          label="Rating"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please give a valid rating"
          onInput={inputHandler}
        /> 

        <Button type="submit" disabled={!formState.isValid}>
          ADD MOVIE
        </Button>
        {errorExists && <div data-bs-toggle="modal" data-bs-target="#errorModalTarget">Error Occured While Creating a Movie Click to see</div>}
      </form>
      </React.Fragment>
    );
  };

export default Movies;