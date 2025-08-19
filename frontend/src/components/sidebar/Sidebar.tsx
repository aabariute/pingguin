import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/useAuth";
import type { Message } from "../../context/chat/ChatContext";
import type { ChatResponse } from "../../context/chat/ChatProvider";
import { useChat } from "../../context/chat/useChat";
import { useUser } from "../../context/user/useUser";
import apiRequest from "../../lib/axios";
import SidebarSkeleton from "./SidebarSkeleton";
import SearchInput from "./SearchInput";
import UserList from "./UserList";

export default function Sidebar() {
  const { authUser, onlineUsers } = useAuth();
  const { isLoading, users, getUsers } = useUser();
  const { sendMessage } = useChat();

  const [lastMessages, setLastMessages] = useState<Array<Message>>([]);
  const [query, setQuery] = useState<string>("");
  const [showOnline, setShowOnline] = useState<boolean>(false);

  // Filtering by query / online only
  const filtered: typeof users =
    query.length < 3
      ? users
      : users.filter((user) => user.nickname.toLowerCase().includes(query));
  const onlineFiltered: typeof users = filtered.filter((user) =>
    onlineUsers.includes(user._id)
  );

  // Sorting by last messages
  const lastByUserId: Record<string, number> = Object.fromEntries(
    lastMessages
      .map((msg: Message) => {
        const chatPartner =
          msg.senderId === authUser?._id
            ? (msg.receiverId as string)
            : (msg.senderId as string);
        return [chatPartner, new Date(msg.createdAt).getTime()];
      })
      .filter(([id]) => !!id)
  );
  const sortByLastMessage = (arr: typeof users) =>
    [...arr].sort((a, b) => {
      const ta = lastByUserId[a._id] ?? 0;
      const tb = lastByUserId[b._id] ?? 0;
      return tb - ta;
    });

  const sorted = sortByLastMessage(filtered);
  const sortedOnline = sortByLastMessage(onlineFiltered);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    async function getLastMessages() {
      try {
        const res = await apiRequest<ChatResponse>(
          "/messages/last-messages",
          "GET"
        );
        setLastMessages(res.data as Array<Message>);
      } catch (error) {
        console.error(error);
      }
    }
    getLastMessages();
  }, [sendMessage]);

  if (isLoading.getUsers) return <SidebarSkeleton />;

  return (
    <aside className="flex flex-col gap-2 p-2">
      <div className="w-full flex justify-between items-center gap-10">
        <SearchInput query={query} setQuery={setQuery} />

        {/* Mobile: toggle online/all */}
        <fieldset className="fieldset lg:hidden bg-base-100/40 py-2 px-3 rounded-md">
          <label className="label">
            <input
              type="checkbox"
              checked={showOnline}
              onChange={() => setShowOnline((show) => !show)}
              className="toggle toggle-md toggle-secondary "
            />
            Online Users
          </label>
        </fieldset>
      </div>

      {/* Mobile list (horizontal scroll) */}
      <div className="block lg:hidden overflow-x-auto w-full">
        <UserList
          users={showOnline ? sortedOnline : sorted}
          lastMessages={lastMessages}
        />
      </div>

      {/* Desktop tabs */}
      <div
        role="tablist"
        className="hidden lg:flex tabs tabs-lift tabs-sm overflow-x-auto w-full"
      >
        <input
          type="radio"
          name="radio"
          className="tab tracking-wide"
          aria-label="All Contacts"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-1">
          <UserList users={sorted} lastMessages={lastMessages} />
        </div>

        <input
          type="radio"
          name="radio"
          className="tab"
          aria-label="Online Users"
        />
        <div className="tab-content bg-base-100 border-base-300 p-1">
          <UserList users={sortedOnline} lastMessages={lastMessages} />
        </div>
      </div>
    </aside>
  );
}
