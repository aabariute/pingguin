import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import apiRequest from "../../lib/axios";
import { logError } from "../../lib/utils/helpers";
import { AuthContext, type SignupFormType, type User } from "./AuthContext";

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  data: User;
}

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState({
    login: false,
    signup: false,
    verifyNickname: false,
    verifyAuth: true,
  });
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Array<string>>([]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const connectSocket = useCallback(() => {
    if (!authUser?._id || socketRef.current?.connected) return;

    socketRef.current = io(BASE_URL, {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    socketRef.current.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  }, [authUser?._id]);

  const disconnectSocket = () => {
    if (socketRef.current?.connected) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const verifyAuth = useCallback(async () => {
    try {
      const res = await apiRequest<AuthResponse>("/auth/verify", "GET");
      setAuthUser(res.data);
      setIsAuthenticated(true);
      // connectSocket();
    } catch (error: unknown) {
      setAuthUser(null);
      setIsAuthenticated(false);
      logError(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, verifyAuth: false }));
    }
  }, []);

  const login = async (
    identifierType: "email" | "nickname",
    identifier: string,
    password: string
  ): Promise<void> => {
    try {
      setIsLoading((prev) => ({ ...prev, login: true }));
      const res = await apiRequest<AuthResponse>("/auth/login", "POST", {
        identifierType,
        identifier,
        password,
      });
      setAuthUser(res.data);
      setIsAuthenticated(true);
      connectSocket();
    } finally {
      setIsLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const signup = async (formData: SignupFormType) => {
    try {
      setIsLoading((prev) => ({ ...prev, signup: true }));
      const res = await apiRequest<AuthResponse>(
        "/auth/signup",
        "POST",
        formData
      );
      setAuthUser(res.data);
      setIsAuthenticated(true);
      connectSocket();
    } finally {
      setIsLoading((prev) => ({ ...prev, signup: false }));
    }
  };

  const logout = async () => {
    try {
      setAuthUser(null);
      setIsAuthenticated(false);
      await apiRequest("/auth/logout", "GET");
      disconnectSocket();
      toast.success("Logged out");
    } catch (error) {
      logError(error);
    }
  };

  const isNicknameAvailable = async (data: { nickname: string }) => {
    try {
      setIsLoading((prev) => ({ ...prev, verifyNickname: true }));
      const res = await apiRequest<AuthResponse>(
        "/auth/check-nickname",
        "POST",
        {
          nickname: data.nickname,
        }
      );

      return res.success;
    } catch (error: unknown) {
      logError(error);
      return false;
    } finally {
      setIsLoading((prev) => ({ ...prev, verifyNickname: false }));
    }
  };

  useEffect(() => {
    connectSocket();
  }, [authUser, connectSocket]); //

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        authUser,
        setAuthUser,
        isAuthenticated,
        verifyAuth,
        login,
        signup,
        logout,
        isNicknameAvailable,
        onlineUsers,
        socketRef,
        disconnectSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
