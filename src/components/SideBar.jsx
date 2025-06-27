import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { SearchInput } from "./SearchInput";
import toast from "react-hot-toast";
import { fetching } from "../utils/fetching";
import { START_NEW_CHAT } from "../utils/constant";
import { useLocation } from "react-router-dom";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../redux/userSlice";
import moment from "moment";

export function SideBar() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { allUsers, allChats, user } = useSelector((state) => state.userReducer);
  const [searchKey, setSearchKey] = useState('');

  async function startNewChat(searchedUserId) {
    try {
      setSearchKey("");
      dispatch(showLoader());
      const response = await fetching({
        path: pathname,
        method: "POST",
        url: START_NEW_CHAT,
        body: { members: [user._id, searchedUserId] },
        token: localStorage.getItem('token'),
      });
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        const upDatedChat = [...allChats, response.data];
        dispatch(setAllChats(upDatedChat));
        dispatch(setSelectedChat(response.data));
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  function openChat(selectedUserId) {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((m) => m._id).includes(user._id) &&
        chat.members.map((m) => m._id).includes(selectedUserId)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  }

  function getLastMessage(selectedUserId){
    const chat = allChats.find(chat => chat?.members?.map((m)=>m._id).includes(selectedUserId));

    let obj = {
      text : "",
      time : ""
    };

    if(!chat || !chat?.lastMessage){
      return obj;
    }else{
      const preFix = chat?.lastMessage?.sender === user._id ? "You: " : "";
      obj.text =  preFix + chat?.lastMessage?.text?.substring(0,15) + "...";
      obj.time = moment(chat?.lastMessage?.createdAt).format("MMMM D, hh:mm A");
    }
    return obj;
  }

  function formatName(ele){
    let fName = ele.firstName[0].toUpperCase() + ele.firstName.slice(1).toLowerCase();
    let lName = ele.lastName[0].toUpperCase() + ele.lastName.slice(1).toLowerCase();
    return fName + " " + lName;
  }

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />

      {allUsers &&
        allUsers
          .filter((ele) => {
            return (
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

                allChats.some((chat) =>
                chat.members.map((m) => m._id).includes(ele._id)
              )
            );
          })
          .map((ele, index) => {
            return (
              <div
                key={ele?._id}
                onClick={() => openChat(ele._id)}
                className="flex items-start justify-between gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl cursor-pointer transition"
              >
                {/* Left: User Name + Message */}
                <div className="flex flex-col w-full">
                  <h5 className="text-white font-medium text-base">
                    {formatName(ele)}
                  </h5>

                  {getLastMessage(ele?._id).text && (
                    <p className="text-sm text-white/60 truncate w-[90%]">
                      {getLastMessage(ele?._id).text}
                    </p>
                  )}
                </div>

                {/* Right: Time and Start Button */}
                <div className="flex flex-col items-end justify-between">
                  {getLastMessage(ele?._id).time && (
                    <p className="text-xs text-white/50 whitespace-nowrap">
                      {getLastMessage(ele?._id).time}
                    </p>
                  )}

                  {!allChats.find((chat) =>
                    chat.members.map((m) => m._id).includes(ele._id)
                  ) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startNewChat(ele._id);
                      }}
                      className="mt-2 text-[11px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md"
                    >
                      Start Chat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
    </div>
  );
}
