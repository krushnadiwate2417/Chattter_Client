import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import { useState } from "react";
import { fetching } from "../utils/fetching";
import { LOGIN, SIGNUP } from "../utils/constant";

function Form(){

    const { pathname } = useLocation();
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        const body = {
            ...(pathname === '/signUp' && {firstName}),
            ...(pathname === '/signUp' && {lastName}),
            email,
            password
        }
        const result = await fetching({
            path : pathname,
            method : "POST",
            body : body,
            url : pathname === '/signUp' ? SIGNUP : LOGIN,
            setError
        })
        console.log(result);
        result && localStorage.setItem('token',result.token);
    }

    return <>
        <form onSubmit={(e)=>handleSubmit(e)}>
            {pathname === "/signUp" && <Input placeholder={"First Name"} type={"text"} setText={setFirstName}/>}
            {pathname === "/signUp" && <Input placeholder={"Last Name"} type={"text"} setText={setLastName}/>}
            <Input placeholder={"Email"} type={"email"} setText={setEmail}/>
            <Input placeholder={"Password"} type={"password"} setText={setPassword}/>
            <button type="submit">{pathname === '/signUp' ? "Sign Up" : "Log In"}</button>
            {error && <div><p>{error}</p></div>}
        </form>
    </>
}

export default Form;