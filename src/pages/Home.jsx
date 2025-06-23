import { useSelector } from "react-redux";
import ChatArea from "../components/ChatArea";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";


function Home(){

    const {selectedChat, user} = useSelector(state=>state.userReducer);
    return <>
        <Header/>
        <div>
            <SideBar/>
            {selectedChat && <ChatArea/>}
        </div>
    </>
}

export default Home;