import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux"
import { fetching } from "../utils/fetching";
import { useLocation } from "react-router-dom";
import { GET_ALL_MESSAGES } from "../utils/constant";
import { useEffect } from "react";
import { hideLoader, showLoader } from "../redux/loaderSlice";


function ChatArea(){
    const {pathname} = useLocation();
    const {selectedChat} = useSelector(state=>state.userReducer);
    const dispatch = useDispatch();

    async function getMessages() {
        try {
            dispatch(showLoader());
            const response = await fetching({
                path : pathname,
                method : "GET",
                url : GET_ALL_MESSAGES + `/${selectedChat._id}`,
                token : localStorage.getItem('token')
            })
            dispatch(hideLoader());
            if(response.success){
                console.log(response);
            }
        } catch (error) {
            toast(error.message);
        }
    }

    return <>
        {   selectedChat &&
            <div>
                <h4>{selectedChat._id}</h4>
            </div>
        }
    </>
}

export default ChatArea;