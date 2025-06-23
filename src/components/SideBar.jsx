import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { SearchInput } from "./SearchInput";
import toast from "react-hot-toast";
import { fetching } from "../utils/fetching";
import { START_NEW_CHAT } from "../utils/constant";
import { useLocation } from "react-router-dom";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../redux/userSlice";


export function SideBar(){
    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const {allUsers,allChats, user} = useSelector((state)=>state.userReducer);

    const [searchKey,setSearchKey] = useState('');

    async function startNewChat(searchedUserId){
        try {
            dispatch(showLoader())
            const response = await fetching({
                path : pathname,
                method : "POST",
                url : START_NEW_CHAT,
                body : {members : [user._id,searchedUserId]},
                token : localStorage.getItem('token')
            })
            dispatch(hideLoader());

            if(response.success){
                toast.success(response.message);
                const upDatedChat = [...allChats, response.data];
                dispatch(setAllChats(upDatedChat));
                dispatch(setSelectedChat(upDatedChat));
            }

            console.log(response);
        } catch (error) {
            toast.error(error.message);
        }
    }

    function openChat(selectedUserId){
        const chat = allChats.find(
            chat=>
                chat.members.map(m=>m._id).includes(user._id)
                &&
                chat.members.map(m=>m._id).includes(selectedUserId)
        );

        if(chat){
            dispatch(setSelectedChat(chat));
        }
    }

    return <>
        <div>
            <SearchInput searchKey={searchKey} setSearchKey={setSearchKey}/>
            {allUsers && allUsers.filter((ele)=>{
                return(
                    (
                        (
                            ele?.firstName.toLowerCase().includes(searchKey.toLowerCase())
                            ||
                            ele?.lastName.toLowerCase().includes(searchKey.toLowerCase())
                        )
                        &&
                        searchKey
                    )
                    ||
                    (
                        allChats.some(chat=>chat.members.map(m=>m._id).includes(ele._id))
                    )
                )
            }).map((ele,index)=>{
                return <div key={ele?._id} onClick={()=>{openChat(ele._id)}}>
                        <h5>{ele?.firstName + " "+ ele?.lastName}</h5>
                        { !allChats.find(chat => chat.members.map(m=>m._id).includes(ele._id))
                        && <button onClick={()=>{
                    startNewChat(ele._id);
                }}>Start Chat</button>}
                    </div>
            })}
        </div>
    </>
}