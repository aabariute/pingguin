import { useContext } from "react";
import { UserContext } from "./UserContext";

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined)
    throw new Error("UserContext was used outside the UserProvider");

  return context;
}
