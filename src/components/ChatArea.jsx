import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux"
import { fetching } from "../utils/fetching";
import { useLocation } from "react-router-dom";
import { GET_ALL_MESSAGES, SEND_MESSAGE } from "../utils/constant";
import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import Input from "./Input";
import moment from "moment";


function ChatArea(){
    const {pathname} = useLocation();
    const {selectedChat, user} = useSelector(state=>state.userReducer);
    const [messageText,setMessageText] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    const selectedUser = selectedChat.members.find(u=>u._id !== user._id)
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
                setAllMessages(response.data);
            }
        } catch (error) {
            toast(error.message);
        }
    }

    async function sendMessage() {
        try {
            dispatch(showLoader());
            const response = await fetching({
                path : pathname,
                method : "POST",
                url : SEND_MESSAGE,
                token : localStorage.getItem('token'),
                body : {
                    chatId : selectedChat._id,
                    sender : user._id,
                    text : messageText,
                }
            })
            dispatch(hideLoader());
            if(response.success){
                console.log(response);
                setMessageText("");
                getMessages();
            }
        } catch (error) {
            toast(error.message);
        }
    }

    useEffect(()=>{getMessages()},[selectedChat]);

    return <>
        {   selectedChat &&
            <div>
                <div>

                    {/**Header*/}
                    <h4>{selectedUser.firstName + " " + selectedUser.lastName}</h4>
                </div>
                <div>
                    {
                        allMessages.length 
                        &&
                        allMessages.map((ele,index)=>{
                            return <div key={index}>
                                    <div>
                                    {ele.text}
                                    </div>    
                                    <div>
                                        {moment(ele.createdAt).format("hh:mm A")}
                                    </div>
                                </div>

                        })
                    }
                </div>
                <div>
                    {/**Send Message */}
                    <Input value={messageText} placeholder={"Write Something..."} setText={setMessageText} type={"text"}/>
                    <button 
                        onClick={()=>{
                            sendMessage();
                        }}
                    >Send</button>
                </div>
            </div>
        }
    </>
}

export default ChatArea;