import React from "react";
import { Link } from "react-router-dom";
import "./UserItem.css"

const UserItem = props => {
    return (
        <li className="user-item">
            <div className= "bg-primary title-white m-2" style={{width: "18rem", textAlign: "center",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)", borderRadius: "2rem", alignItems:"center"}} >
                <Link to= {`./${props.id}/movies`}>
                    <img className= "card-image"  src = {`http://localhost:5000/${props.image}`} alt = {props.name} style = {{width : "14rem", height :"14rem", marginTop: "1.5rem" }}/>

                    <div  className= "card-body" >
                        <h2 className= "card-title">{props.name}</h2>
                        <p className= "card-text">{props.genres}</p>
                        <p className= "card-text">{props.reviewCount} {props.reviewCount ===1 ? 'Review' : "Reviews" }</p>
                    </div>
                </Link>
            </div>
        </li>
    )
}

export default UserItem;
