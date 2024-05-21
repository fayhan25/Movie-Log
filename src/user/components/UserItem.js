import React from "react";
import { Link } from "react-router-dom";
import "./UserItem.css"
import Image from 'react-bootstrap/Image'
import Card from "react-bootstrap/Card";
const UserItem = props => {
    return (
        <li className="user-item">
        <Card style = {{backgroundColor: "#9370DB", height: '100%'}}>
            <Link to= {`./${props.id}/movies`}>
            <Card.Img rounded = {true} style = {{width: '15.4rem', height: '20rem'}} variant="top" src = {`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt="card-img" />
            <Card.Body>
            <Card.Title >{props.name}</Card.Title>
            <Card.Text style={{ textAlign: "justify", color: "white" }}>
                {props.genres}
            </Card.Text>
            <Card.Text style={{ textAlign: "justify", color: "white" }}>{props.reviewCount} {props.reviewCount ===1 ? 'Review' : "Reviews" }</Card.Text>
            </Card.Body>
            </Link>
        </Card> 
        </li>
    )
}

export default UserItem;
