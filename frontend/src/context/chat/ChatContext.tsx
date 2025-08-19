import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User } from "../auth/AuthContext";

export interface MessageInput {
  messageText?: string;
  images?: string[];
}

export interface Message extends MessageInput {
  _id?: string;
  senderId?: string;
  receiverId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DarkTheme = {
  mode: "dark";
  theme: "business" | "coffee" | "night" | "dracula";
};

export type LightTheme = {
  mode: "light";
  theme: "corporate" | "emerald" | "winter" | "nord";
};

export type Theme = DarkTheme | LightTheme;

interface ChatContext {
  isLoading: {
    getMessages: boolean;
    sendMessage: boolean;
  };
  selectedUser: User | null;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
  messages: Array<Message> | null;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;

  sendMessage(formData: MessageInput): Promise<Message | null>;
  getMessages(userId: string, skip: number): Promise<Array<Message>>;
}

export const ChatContext = createContext<ChatContext>({} as ChatContext);
