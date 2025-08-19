import { IoClose } from "react-icons/io5";
import { useAuth } from "../../context/auth/useAuth";
import { useChat } from "../../context/chat/useChat";

export default function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();

  return (
    <div className="p-2 bg-accent/60 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="size-11 rounded-full">
            <img
              src={selectedUser!.avatar || "avatar.png"}
              alt={`Profile picture of user ${selectedUser!.nickname}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-medium leading-none">{selectedUser!.nickname}</h3>
          <p className="text-xs text-base-content/70">
            {onlineUsers.includes(selectedUser!._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="bg-base-200/60 p-1 rounded-md cursor-pointer hover:bg-base-200/70"
      >
        <IoClose className="size-4" />
      </button>
    </div>
  );
}
