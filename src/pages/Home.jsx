import { useSelector } from "react-redux";
import ChatArea from "../components/ChatArea";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io('http://localhost:3000');

function Home() {
  const { selectedChat,user } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(()=>{
    if(user){
      socket.emit('join-room',user._id);
      socket.emit('users-login',user._id);
      socket.on('onlineUsers-list',(onlineUsersList)=>{
        setOnlineUsers(onlineUsersList);
      })
    }
  },[user])

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <SideBar socket = {socket} onlineUsers={onlineUsers}/>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-slate-900">
          {selectedChat ? (
            <ChatArea socket={socket} />
          ) : (
            <div className="h-full flex items-center justify-center text-white/50 text-lg">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
