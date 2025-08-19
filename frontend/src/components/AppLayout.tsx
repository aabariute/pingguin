import { Outlet } from "react-router-dom";
import { useChat } from "../context/chat/useChat";

export default function AppLayout() {
  const { theme } = useChat();

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-1 sm:px-5 md:px-10 bg-gradient-to-br ${
        theme.mode === "light"
          ? "from-primary/60 via-secondary/60 to-accent/60"
          : "from-primary/40 via-secondary/40 to-accent/20"
      }`}
    >
      <Outlet />
    </main>
  );
}
