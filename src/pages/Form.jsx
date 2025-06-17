import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useState } from "react";
import { fetching } from "../utils/fetching";
import { LOGIN, SIGNUP } from "../utils/constant";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";

function Form(){
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const dispatch = useDispatch();

    async function handleSubmit(e){
        e.preventDefault();
        const body = {
            ...(pathname === '/signUp' && {firstName}),
            ...(pathname === '/signUp' && {lastName}),
            email,
            password
        }
        try {
            dispatch(showLoader());
            const result = await fetching({
                path : pathname,
                method : "POST",
                body : body,
                url : pathname === '/signUp' ? SIGNUP : LOGIN,
            })
            dispatch(hideLoader());
            result && localStorage.setItem('token',result.token);
            if(result.success){
                toast.success(result.message);
                navigate("/");
            }else{
                toast.error(result.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    return <>
        <form onSubmit={(e)=>handleSubmit(e)}>
            {pathname === "/signUp" && <Input placeholder={"First Name"} type={"text"} setText={setFirstName}/>}
            {pathname === "/signUp" && <Input placeholder={"Last Name"} type={"text"} setText={setLastName}/>}
            <Input placeholder={"Email"} type={"email"} setText={setEmail}/>
            <Input placeholder={"Password"} type={"password"} setText={setPassword}/>
            <button type="submit">{pathname === '/signUp' ? "Sign Up" : "Log In"}</button>
        </form>
    </>
}

export default Form;