import {React, useContext}from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import "./NavLinks.css";
import { Button } from "react-bootstrap";
const NavLinks = props =>{
    const auth = useContext(AuthContext);
    return <ul className="nav-links">
        <li>
            <NavLink to = "/">Movie Critics</NavLink>
        </li>
        {auth.isLoggedIn && <li>
            <NavLink to = {`/${auth.userId}/movies`}>My Reviews</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to = "/movies/new">Add Review</NavLink>
        </li>}
        {!auth.isLoggedIn && <li>
            <NavLink to = "/auth">Sign In</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <Button onClick = {auth.logout} to = "/auth">Log Out</Button>
        </li>}
    </ul>
}

export default NavLinks;