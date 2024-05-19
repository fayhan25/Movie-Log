import React from "react";
import "./UserList.css";
import { Container, Col, Row } from "react-bootstrap";
import UserItem from "./UserItem"

const UserList = props => {
    if (!props.items){
        return <div className="center">
            <h1> There are no users</h1>
        </div>
    }

    return <Container>
   
    <ul>
    <Row style={{ justifyContent: "center"}}>
        {props.items.map(users => (
            <Col md = {4}>
            <UserItem
                key = {users.id}
                id = {users.id}
                image = {users.image}
                genres = {users.genres}
                name = {users.name}
                reviewCount = {users.movies.length}
            />
            </Col>
        ))}
        </Row>
    </ul>

    </Container>
}

export default UserList;
