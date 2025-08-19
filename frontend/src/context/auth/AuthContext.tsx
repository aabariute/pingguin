import { createContext, type Dispatch, type RefObject } from "react";
import { io } from "socket.io-client";

export interface User {
  _id: string;
  nickname: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupFormType {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface AuthContext {
  isLoading: {
    login: boolean;
    signup: boolean;
    verifyNickname: boolean;
    verifyAuth: boolean;
  };
  authUser: User | null;
  setAuthUser: Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  onlineUsers: Array<string>;
  socketRef: RefObject<ReturnType<typeof io> | null>;

  verifyAuth(): Promise<void>;
  login(
    identifierType: "email" | "nickname",
    identifier: string,
    password: string
  ): Promise<void>;
  logout(): Promise<void>;
  signup(formData: SignupFormType): Promise<void>;
  isNicknameAvailable(data: { nickname: string }): Promise<boolean>;
  disconnectSocket(): void;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);
