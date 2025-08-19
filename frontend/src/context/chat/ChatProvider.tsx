import type React from "react";
import { useCallback, useEffect, useState } from "react";
import apiRequest from "../../lib/axios";
import { DEFAULT_THEME } from "../../lib/utils/constants";
import { logError } from "../../lib/utils/helpers";
import type { User } from "../auth/AuthContext";
import {
  ChatContext,
  type Message,
  type MessageInput,
  type Theme,
} from "./ChatContext";

export interface ChatResponse {
  success: boolean;
  results?: number;
  data: Message | Array<Message>;
}

export function ChatProvider(props: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState({
    getMessages: false,
    sendMessage: false,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([]); // allow only 10 messages to be visible
  const [theme, setTheme] = useState<Theme>((): Theme => {
    return JSON.parse(localStorage.getItem("theme") as string) || DEFAULT_THEME;
  });

  const getMessages = useCallback(
    async (userId: string, skip = 0): Promise<Message[]> => {
      try {
        setIsLoading((prev) => ({ ...prev, getMessages: true }));
        const res = await apiRequest<ChatResponse>(
          `/messages/${userId}?skip=${skip}`,
          "GET"
        );
        setMessages(res.data as Message[]);

        return res.data as Message[];
      } catch (error) {
        logError(error);
        return [];
      } finally {
        setIsLoading((prev) => ({ ...prev, getMessages: false }));
      }
    },
    []
  );

  const sendMessage = async (
    formData: MessageInput
  ): Promise<Message | null> => {
    try {
      setIsLoading((prev) => ({ ...prev, sendMessage: true }));
      const res = await apiRequest<ChatResponse>(
        `/messages/send/${selectedUser?._id}`,
        "POST",
        formData
      );
      setMessages((prev) => [...prev, res.data as Message]);

      return res.data as Message;
    } catch (error: unknown) {
      logError(error);
      return null;
    } finally {
      setIsLoading((prev) => ({ ...prev, sendMessage: false }));
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme.theme);
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        messages,
        isLoading,
        sendMessage,
        getMessages,
        theme,
        setTheme,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}
