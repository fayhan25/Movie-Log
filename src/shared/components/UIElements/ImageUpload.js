import React, {useRef,useState,useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import './ImageUpload.css'

const ImageUpload = props => {
    const filePickerRef = useRef();
    const [file,setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    useEffect(()=>{
        if (!file){
            return
        }
        const fileReader = new FileReader();
        fileReader.onload = () =>{
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    },[file]);
    
    const onChangeHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length ===1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true
        }
        else{
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    }

    const pickImageHandler= () =>{
        filePickerRef.current.click();
    }
    return (
        <div className='form-control' style={{backgroundColor : "#9370DB"}}>
            <input id ={props.id} ref = {filePickerRef} style = {{display:"none"}} type='file' accept='.jpg, .jpeg, .png' onChange={onChangeHandler}/>
                <div className={`image-upload ${props.center && 'center'}`}>
                    <div className='image-upload__preview' style={{backgroundColor: "white"}}>
                        {previewUrl && <img src= {previewUrl} alt='preview'/>}
                        {!previewUrl && <p>Please pick an Image</p>}
                    </div>
                <Button type='button' onClick={pickImageHandler}> PICK IMAGE </Button>
                </div>
        </div>
    )
}

export default ImageUpload;