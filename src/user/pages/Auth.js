import React, { useState,useContext } from "react";
import { useForm } from "../../shared/components/hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/utils/validators";
import Input from "../../shared/components/UIElements/Input";
import Button from 'react-bootstrap/Button';
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/components/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ModalForError from "../../shared/components/UIElements/ModalForError";
import ImageUpload from "../../shared/components/UIElements/ImageUpload";
import './Auth.css'

const Auth = props => {
    const [loggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [errorExists, setErrorExists] = useState(false);
    const auth = useContext(AuthContext);

    const [formState, inputHandler, changeHandler] =  useForm( {
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }}, false);

        
    const loginMode = () => {
        if (!loggedIn){
            changeHandler({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else{
            changeHandler(
                {
                ...formState.inputs,
                name: {
                    value : '',
                    isValid : false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoggedIn(prevMode => !prevMode)
        }

    const submitForm = async (event) =>{
        event.preventDefault();
        console.log(formState.inputs);
        if (loggedIn){
            try{
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_URL}/users/login`,{
                    method: 'post',
                    headers: {
                        'Content-Type' : 'application/json'    
                    },
                    body: JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                })
                const responseData = await response.json();
                if (!response.ok){
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                auth.login(responseData.userId, responseData.token);
            }catch(err){
                setIsLoading(false);
                setErrorExists(true);
                setIsError(err.message || "There was a problem logging in");
            }
        }
        else{
            try{
                setIsLoading(true);
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)
                const response = await fetch(`${process.env.REACT_APP_URL}/users/signup`,{
                    method: 'POST',
                    body: formData
                })
                const responseData = await response.json();
                if (!response.ok){
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                auth.login(responseData.userId, responseData.token);
            }catch(err){
                setIsLoading(false);
                setErrorExists(true);
                setIsError(err.message || "There was a problem signing up ");
            }
        }
      }

      const errorHandler = () =>{
        setIsError(null);
        setErrorExists(false);
      }
    return (
        <React.Fragment >
            {errorExists && <ModalForError                 
                id = "errorModalTarget" 
                ariaLabel="errorModalTargetLabel" 
                title = "There Was an error" 
                body = {isError}
                onClick = {errorHandler}
                />}
            <Card className = "auth-form" style={{backgroundColor:"#9370DB", width: "50%"}}>
                {isLoading && <LoadingSpinner asOverLay/> }
                <form className="form-submit" onSubmit={submitForm}  >
                    {!loggedIn && 
                    <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid Name."
                        onInput={inputHandler}
                    />}
                    {!loggedIn &&
                    <ImageUpload id = "image" onInput = {inputHandler}/>
                    }
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email."
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid password."
                        onInput={inputHandler}
                    />


                    <Button type="submit" disabled={!formState.isValid}>
                        {loggedIn ? <div>LOGIN</div> : <div>SIGN UP</div>}
                    </Button>
                    <Button onClick={loginMode}>{loggedIn ? <div>SIGN UP</div> : <div>LOGIN</div>}</Button>
                    {errorExists && <div data-bs-toggle="modal" data-bs-target="#errorModalTarget">Error Occured Click to see</div>}
                </form>
            </Card>
        </React.Fragment>
    )
}

export default Auth