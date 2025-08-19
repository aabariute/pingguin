import type { User } from "../../context/auth/AuthContext";
import { useAuth } from "../../context/auth/useAuth";
import type { Message } from "../../context/chat/ChatContext";
import { useChat } from "../../context/chat/useChat";
import { getRelativeTime } from "../../lib/utils/helpers";

export default function SidebarListItem({
  user,
  lastMessage,
}: {
  user: User;
  lastMessage?: Message;
}) {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();

  return (
    <li
      className={`flex lg:gap-4 cursor-pointer hover:bg-base-300/30 rounded-xl p-1 ${
        selectedUser?._id === user._id
          ? "bg-base-300/70 hover:bg-base-300/70"
          : ""
      }`}
      onClick={() => setSelectedUser(user)}
    >
      <div
        className={`chat-image avatar ${
          onlineUsers.includes(user._id) ? "avatar-online" : "avatar-offline"
        }`}
      >
        <div className="size-11 rounded-full">
          <img
            src={user.avatar || "avatar.png"}
            alt={`Profile picture of user ${user.nickname}`}
            loading="lazy"
          />
        </div>
      </div>

      <div className="hidden w-full overflow-x-hidden lg:flex lg:flex-col lg:justify-center lg:gap-0.5">
        <div className="font-semibold">{user.nickname}</div>

        {!!lastMessage?.images?.length && (
          <div className="text-xs opacity-60 flex justify-between">
            <span className="truncate overflow-hidden whitespace-nowrap max-w-[calc(100%-3rem)]">
              {lastMessage.senderId === user._id
                ? `${user.nickname} sent a picture`
                : "You sent a picture"}
            </span>
            <span className="px-1 text-nowrap">
              {getRelativeTime(lastMessage.createdAt)}
            </span>
          </div>
        )}

        {lastMessage?.messageText && (
          <div className=" text-xs opacity-60 flex justify-between gap-2">
            <span className="truncate overflow-hidden whitespace-nowrap max-w-[calc(100%-3rem)]">
              {lastMessage.senderId === user._id ? null : <span>You: </span>}
              <span>{lastMessage.messageText}</span>
            </span>
            <span className="px-1 text-nowrap">
              {getRelativeTime(lastMessage.createdAt)}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}
