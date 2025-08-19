import { createContext } from "react";
import type { User } from "../auth/AuthContext";

export interface ChangePassword {
  passwordCurrent: string;
  passwordNew: string;
  passwordConfirm: string;
}

interface UserContext {
  isLoading: {
    getUsers: boolean;
    updateAvatar: boolean;
    updatePassword: boolean;
    deleteAccount: boolean;
  };
  users: Array<User>;

  getUsers(): Promise<void>;
  updateAvatar(data: { avatar: string }): Promise<void>;
  updatePassword(formData: ChangePassword): Promise<void>;
  deleteAccount(curPassword: string): Promise<void>;
}

export const UserContext = createContext<UserContext>({} as UserContext);
