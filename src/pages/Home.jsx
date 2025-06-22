import ChatArea from "../components/ChatArea";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";


function Home(){
    return <>
        <Header/>
        <div>
            <SideBar/>
            <ChatArea/>
        </div>
    </>
}

export default Home;