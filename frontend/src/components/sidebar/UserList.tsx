import type { User } from "../../context/auth/AuthContext";
import type { Message } from "../../context/chat/ChatContext";
import SidebarListItem from "./SidebarListItem";

export default function UserList({
  users,
  lastMessages,
}: {
  users: Array<User>;
  lastMessages: Array<Message>;
}) {
  if (users.length === 0)
    return (
      <div className="flex justify-center items-center lg:flex-col text-sm text-base-content/60 py-4 font-light">
        <span>No pings in sight...</span>
        <span>This iceberg is empty! 🧊</span>
      </div>
    );

  return (
    <ul className="flex gap-1 lg:flex-col">
      {/* <ul className="flex gap-1 flex-col"> */}
      {users.map((user) => (
        <SidebarListItem
          key={user._id}
          user={user}
          lastMessage={lastMessages.find(
            (msg) => msg.senderId === user._id || msg.receiverId === user._id
          )}
        />
      ))}
    </ul>
  );
}
