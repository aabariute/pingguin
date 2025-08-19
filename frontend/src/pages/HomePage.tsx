import ChatContainer from "../components/chatContainer/ChatContainer";
import Container from "../components/Container";
import Header from "../components/Header";
import ProfileModal from "../components/modals/ProfileModal";
import ThemeModal from "../components/modals/ThemeModal";
import Sidebar from "../components/sidebar/Sidebar";
import StartChat from "../components/StartChat";
import { useChat } from "../context/chat/useChat";

export default function HomePage() {
  const { selectedUser, theme } = useChat();

  return (
    <>
      <ThemeModal />
      <ProfileModal />

      <Container maxWidth="max-w-full" px="px-0" py="py-0">
        <div className="h-[calc(100vh-6px)] sm:h-[calc(100vh-16px)] flex justify-center">
          <div className="h-full w-full grid grid-cols-1 grid-rows-[auto_auto_1fr] lg:grid-cols-[1fr_3fr] lg:grid-rows-[auto_1fr] min-h-0">
            <div
              className={`row-[1] col-span-full ${
                theme.mode === "light" ? "bg-white/50" : "bg-zinc-800/70"
              }`}
            >
              <Header />
            </div>
            <div
              className={`lg:row-[2] lg:col-[1] min-h-0 lg:overflow-y-auto ${
                theme.mode === "light" ? "bg-white/30" : "bg-zinc-800/50"
              }`}
            >
              <Sidebar />
            </div>
            <div
              className={`lg:row-[2] lg:col-[2] min-h-0 overflow-y-auto ${
                theme.mode === "light" ? "bg-white/20" : "bg-zinc-800/20"
              }`}
            >
              {!selectedUser ? <StartChat /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
