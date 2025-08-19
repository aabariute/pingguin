import type React from "react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import apiRequest from "../../lib/axios";
import { logError } from "../../lib/utils/helpers";
import type { User } from "../auth/AuthContext";
import { useAuth } from "../auth/useAuth";
import { UserContext, type ChangePassword } from "./UserContext";

export interface UserResponse {
  success: boolean;
  data?: User | Array<User>;
}

export function UserProvider(props: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState({
    getUsers: false,
    updateAvatar: false,
    updatePassword: false,
    deleteAccount: false,
  });
  const [users, setUsers] = useState<Array<User>>([]);
  const { setAuthUser, disconnectSocket } = useAuth();

  const getUsers = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, getUsers: true }));
      const res = await apiRequest<UserResponse>("/users", "GET");
      setUsers(res.data as Array<User>);
    } catch (error: unknown) {
      logError(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, getUsers: false }));
    }
  }, []);

  const updateAvatar = async (data: { avatar: string }) => {
    try {
      setIsLoading((prev) => ({ ...prev, updateAvatar: true }));
      const res = await apiRequest<UserResponse>(
        "/users/update-profile",
        "PATCH",
        data
      );

      if (!res.data) {
        throw new Error("Failed to update avatar");
      } else {
        setAuthUser(res.data as User);
        toast.success("Avatar updated");
      }
    } catch (error: unknown) {
      logError(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, updateAvatar: false }));
    }
  };

  const updatePassword = async (formData: ChangePassword) => {
    try {
      setIsLoading((prev) => ({ ...prev, updatePassword: true }));
      const res = await apiRequest<UserResponse>(
        "/users/update-password",
        "PATCH",
        formData
      );
      if (!res.data) {
        throw new Error("Failed to update password");
      } else {
        setAuthUser(res.data as User);
        toast.success("Password updated");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, updatePassword: false }));
    }
  };

  const deleteAccount = async (passwordCurrent: string) => {
    try {
      setIsLoading((prev) => ({ ...prev, deleteAccount: true }));
      await apiRequest<UserResponse>("/users/delete-account", "PATCH", {
        passwordCurrent,
      });
      setAuthUser(null);
      disconnectSocket();
      toast.success("Account deleted successfully");
    } finally {
      setIsLoading((prev) => ({ ...prev, deleteAccount: false }));
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoading,
        users,
        getUsers,
        updateAvatar,
        updatePassword,
        deleteAccount,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
