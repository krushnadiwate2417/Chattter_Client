import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { SearchInput } from "./SearchInput";


export function SideBar(){

    const {allUsers,allChats} = useSelector((state)=>state.userReducer);

    const [searchKey,setSearchKey] = useState('')

    return <>
        <div>
            <SearchInput searchKey={searchKey} setSearchKey={setSearchKey}/>
            {allUsers && allUsers.filter((ele)=>{
                return(
                    (
                    (ele?.firstName.toLowerCase().includes(searchKey.toLowerCase())
                    ||
                    ele?.lastName.toLowerCase().includes(searchKey.toLowerCase()))
                    &&
                    searchKey
                    )
                    ||
                    (
                        allChats.some(chat=>chat.members.includes(ele._id))
                    )
                )
            }).map((ele,index)=>{
                return <h5 key={ele?._id}>{ele?.firstName + " "+ ele?.lastName}</h5>
            })}
        </div>
    </>
}