import React from "react";
import { Link } from "react-router-dom";
import "./UserItem.css"
import Image from 'react-bootstrap/Image'
import Card from "react-bootstrap/Card";
const UserItem = props => {
    return (
        <li className="user-item">
            {/* <div className= "bg-primary title-white m-2" style={{width: "100%", textAlign: "center",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)", borderRadius: "10%", alignItems:"center"}} >
                <Link to= {`./${props.id}/movies`}> 
                    <div  className= "card-body" >
                        <Image className= "img-fluid" style = {{width:"80%", height: "120%"}} roundedCircle= {true} src = {`http://localhost:5000/${props.image}`} alt = {props.name}/>
                        <h2 className= "card-title">{props.name}</h2>
                        <p className= "card-text">{props.genres}</p>
                        <p className= "card-text">{props.reviewCount} {props.reviewCount ===1 ? 'Review' : "Reviews" }</p>
                    </div>
                </Link>
            </div> */}
        <Card style = {{backgroundColor: "#9370DB", height: '100%'}}>
            <Link to= {`./${props.id}/movies`}>
            <Card.Img rounded = {true} style = {{width: '15.4rem', height: '20rem'}} variant="top" src = {`http://localhost:5000/${props.image}`} alt="card-img" />
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
