import React from "react";
import { Button } from "react-bootstrap";
const Modal = props => {
    return (
        <div className="modal fade" id={props.id} tabIndex="-1" aria-labelledby={props.ariaLabel} aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title" id={props.ariaLabel} style={{marginLeft: "9rem"}}>{props.title}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {props.body}
            </div>
            <div className="modal-footer">
                <Button className = "close" onClick={props.onClick} data-bs-dismiss="modal">Cancel</Button>
                {props.deleteModal ?  <Button className= "btn-danger" onClick = {props.onClickDelete} data-bs-dismiss="modal">DELETE</Button> : null}
            </div>
            </div>
        </div>
    </div>
 )   
}

export default Modal;