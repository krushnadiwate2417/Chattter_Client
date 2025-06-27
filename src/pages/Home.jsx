import { useSelector } from "react-redux";
import ChatArea from "../components/ChatArea";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";

function Home() {
  const { selectedChat } = useSelector((state) => state.userReducer);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <SideBar />
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-slate-900">
          {selectedChat ? (
            <ChatArea />
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
