import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetching } from "../utils/fetching";
import { GETALLUSERS, GETUSER } from "../utils/constant";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {setAllUsers, setUser} from "./../redux/userSlice";


export function ProtectedRoute({children}){
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const dispatch = useDispatch();


    const getUser = async ()=>{
        try {
            const result = await fetching({
                path : pathname,
                url : GETUSER,
                method : "GET",
                token : localStorage.getItem('token')
            })

            const result2 = await fetching({
                path : pathname,
                url : GETALLUSERS,
                method : "GET",
                token : localStorage.getItem('token')
            })

            if(result.success && result2.success){
                dispatch(setUser(result.user))
                dispatch(setAllUsers(result2.users))
            }else{
                toast.error(result.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.message);
            navigate('/login');
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('token') !== "undefined" && localStorage.getItem('token')){
            getUser();
        }else{
            navigate('/login')
        }
    },[])

    return (
        <div>
            {children}
        </div>
    )

}