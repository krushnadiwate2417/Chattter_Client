import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetching } from "../utils/fetching";
import { useLocation } from "react-router-dom";
import { CLEAR_UNREAD_MESSAGE, GET_ALL_MESSAGES, SEND_MESSAGE } from "../utils/constant";
import { useEffect, useState, useRef } from "react";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import Input from "./Input";
import moment from "moment";
import store from "./../redux/store";
import { setAllChats } from "../redux/userSlice";

function ChatArea({socket}) {
  const { pathname } = useLocation();
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const dispatch = useDispatch();
  const chatBottomRef = useRef(null);
  const [isTyping,setIsTyping] = useState(false);
  const [data,setData] = useState(null);

  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  async function getMessages() {
    try {
      dispatch(showLoader());
      const response = await fetching({
        path: pathname,
        method: "GET",
        url: GET_ALL_MESSAGES + `/${selectedChat._id}`,
        token: localStorage.getItem("token"),
      });
      dispatch(hideLoader());
      if (response.success) {

        setAllMessages(response.data);
      }
    } catch (error) {
      toast(error.message);
    }
  }

  async function sendMessage(img=null) {
    try {

      const newMessage = {
          chatId: selectedChat._id,
          sender: user._id,
          text: messageText,
          img
        }

        socket.emit('send-message',{
          ...newMessage,
          members : selectedChat.members.map(m=>m._id),
          read : false,
          createdAt : moment().format("DD-MM-YYYY hh:mm:ss")
        })

      const response = await fetching({
        path: pathname,
        method: "POST",
        url: SEND_MESSAGE,
        token: localStorage.getItem("token"),
        body: newMessage ,
      });

      if (response.success) {
        console.log(response);
        setMessageText("");
        getMessages();
      }
    } catch (error) {
      toast(error.message);
    }
  };

  async function sendImage(e){
    const image = e.target.files[0];
    console.log(image);
    const reader = new FileReader();

    reader.readAsDataURL(image);

    reader.onloadend = async ()=>{
      sendMessage(reader.result);
    }

  }

  async function clearUnreadCount(){
    try {

      socket.emit('clear-unread-msgs',{
        chatId : selectedChat._id,
        members : selectedChat.members.map((m)=>m._id)
      })

      const response = await fetching({
        path : pathname,
        method : "PATCH",
        url : CLEAR_UNREAD_MESSAGE,
        body : {chatId : selectedChat._id},
        token : localStorage.getItem('token')
      })

      if(response.success){
        const upDatedChats = allChats.map((chat)=>{
          if(chat._id === selectedChat._id){
            return response.data;
          }
          return chat;
        })
        dispatch(setAllChats(upDatedChats));
      }

    } catch (error) {
      toast(error.message);
    }
  }

  function formatTime(timestamp) {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return moment(timestamp).format("MMMM D, hh:mm A");
    }
  }

  useEffect(() => {
    getMessages();
    if(selectedChat?.lastMessage?.sender !== user._id)
    {
      clearUnreadCount();
    }

    socket.off("recieve-message").on("recieve-message",(message)=>{
      const selectedChat = store.getState().userReducer.selectedChat;
      const user = store.getState().userReducer.user;
      if(selectedChat._id === message.chatId){
      setAllMessages(prevMsgs => [...prevMsgs,message])
      }
      
      if(selectedChat._id === message._id && message.sender !== user._id){
        clearUnreadCount();
      }
    })

    socket.on('msg-count-cleared', data=>{
      const selectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if(selectedChat._id === data.chatId){
        const updatedChats = allChats.map((chat)=>{
        if(chat._id === data.chatid){
          return {...chat,unReadMessageCount : 0}
        }
        return chat
      })
      dispatch(setAllChats(updatedChats));

      setAllMessages(prev => {
        return prev.map(msg => {
          return {...msg, read : true};
        })
      })
    }
    })

    socket.on('started-typing',(data)=>{
      setData(data);
      if(selectedChat._id === data.chatId && data.sender !== user._id){
        setIsTyping(true);
        const timeOut = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    })

  }, [selectedChat]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800 border-b border-slate-700">
        <h4 className="text-white text-xl font-semibold">
          {selectedUser.firstName + " " + selectedUser.lastName}
        </h4>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-900">
        {allMessages.length > 0 &&
          allMessages.map((ele, index) => {
            const isSender = ele.sender === user._id;
            return (
              <div
                key={index}
                className={`flex flex-col max-w-[75%] ${
                  isSender ? "ml-auto items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl text-white ${
                    isSender
                      ? "bg-blue-600 rounded-br-none"
                      : "bg-slate-700 rounded-bl-none"
                  }`}
                >
                  {ele.text}
                  {ele?.img && <img src={ele.img} alt="image" height={30} width={30}/>}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {formatTime(ele.createdAt)}
                  {isSender && ele.read && <p>Read</p>}
                </div>
              </div>
            );
          })}
          {isTyping && selectedChat?.members.map((m)=>m._id).includes(data?.sender) && <div><i>Typing...</i></div>}
        <div ref={chatBottomRef}></div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-700 bg-slate-800 flex items-center space-x-3">
        <div className="flex-1">
          <input
            value={messageText}
            placeholder="Write something..."
            type="text"
            onChange={(e)=>{
              setMessageText(e.target.value);
              socket.emit('user-typing',{
                chatId : selectedChat._id,
                members : selectedChat.members.map(m=>m._id),
                sender : user._id
              })
            }}
          />
        </div>

        <div>
          <label for="file">Send Images</label>
            <input
            id="file"
            className="hidden"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={sendImage}
            />
        </div>

        <button
          onClick={()=>sendMessage()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
