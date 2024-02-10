import {React,useState,useEffect} from "react";
import UserList from "../components/UserList";

const Users = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [errorExists, setErrorExists] = useState(false);
    const [users, setUsers] = useState();
    useEffect(() => {
        const usersFnc = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/users');
                const responseData = await response.json();
                if (!response.ok){
                    throw new Error(responseData.message);
                }
                setUsers(responseData.allUsers);
            }catch(err){
                setIsLoading(false);
                setErrorExists(true);
                setIsError(err.message || "There was a problem logging in");
            }
        }
        usersFnc();
    }, [])
    return <UserList items = {users}/>
}

export default Users;