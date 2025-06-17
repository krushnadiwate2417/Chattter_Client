import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetching } from "../utils/fetching";
import { GETUSER } from "../utils/constant";
import toast from "react-hot-toast";


export function ProtectedRoute({children}){
    const navigate = useNavigate();
    const {pathname} = useLocation();


    const getUser = async ()=>{
        try {
            const result = await fetching({
                path : pathname,
                url : GETUSER,
                method : "GET",
                token : localStorage.getItem('token')
            })
            if(result.success){

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