import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if (!state.inputs[inputId]){
            continue;
          }
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid }
          },
          isValid: formIsValid
        };
        case 'SET_STATE':
          return{
            inputs: action.inputs,
            isValid: action.isValid
          }
      default:
        return state;
    }
  };

  export const useForm = (initialInputs, initalValidity) =>{
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initalValidity
      });
    

      const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
          type: 'INPUT_CHANGE',
          value: value,
          isValid: isValid,
          inputId: id
        });
      }, []);

      const changeHandler = useCallback ((inputs, isValid) => {
        dispatch({
          type: 'SET_STATE',
          inputs: inputs,
          isValid : isValid
        })
      },[])

      return [formState, inputHandler,changeHandler];
  }