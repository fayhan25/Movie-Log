import React from "react";
import "./UserList.css";

import UserItem from "./UserItem"

const UserList = props => {
    if (!props.items){
        return <div className="center">
            <h1> There are no users</h1>
        </div>
    }

    return <ul>
        {props.items.map(users => (
            <UserItem
                key = {users.id}
                id = {users.id}
                image = {users.image}
                genres = {users.genres}
                name = {users.name}
                reviewCount = {users.movies.length}

            />
        ))}
    </ul>
}

export default UserList;
