import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export function useChat() {
  const context = useContext(ChatContext);

  if (context === undefined)
    throw new Error("ChatContext was used outside the ChatProvider");

  return context;
}
