import { useEffect, useRef, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "../../context/auth/useAuth";
import type { Message } from "../../context/chat/ChatContext";
import { useChat } from "../../context/chat/useChat";
import { MESSAGES_PER_PAGE } from "../../lib/utils/constants";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageTimeDisplay from "./timeDisplay/MessageTimeDisplay";
import NewDayDisplay from "./timeDisplay/NewDayDisplay";

export default function ChatContainer() {
  const { authUser, socketRef } = useAuth();
  const { getMessages, selectedUser } = useChat();

  const [totalMessages, setTotalMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreMessages = async () => {
    const newMessages = await getMessages(
      selectedUser!._id,
      page * MESSAGES_PER_PAGE
    );
    if (newMessages.length < MESSAGES_PER_PAGE) setHasMore(false);

    setPage((prev) => prev + 1);

    setTotalMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m._id));
      const filtered = newMessages.filter((m) => !existingIds.has(m._id));
      return [...filtered.reverse(), ...prev];
    });
  };

  useEffect(() => {
    const fetchInitial = async () => {
      const messages = await getMessages(selectedUser!._id, 0);
      setTotalMessages(messages.reverse());
      setPage(1);

      if (messages.length < MESSAGES_PER_PAGE) setHasMore(false);
    };

    fetchInitial();
  }, [selectedUser, getMessages]);

  useEffect(() => {
    const selectedUserId = selectedUser?._id;
    const socket = socketRef.current;

    if (!selectedUserId || !socket) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.senderId !== selectedUserId) return;

      setTotalMessages((prev) =>
        prev.some((m) => m._id === newMessage._id)
          ? prev
          : [...prev, newMessage]
      );
    };

    socket.off("newMessage", handleNewMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser?._id, socketRef]);

  return (
    <div className="h-full flex flex-col">
      <ChatHeader />

      <div
        id="scrollableDiv"
        className="flex-1 overflow-y-scroll flex flex-col-reverse px-3"
      >
        <InfiniteScroll
          dataLength={totalMessages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          inverse={true}
          loader={
            <div className="flex justify-center py-2">
              <LuLoaderCircle className="size-5 animate-spin text-neutral" />
            </div>
          }
          scrollableTarget="scrollableDiv"
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          <div className="flex flex-col gap-2">
            {!totalMessages.length && (
              <p className="text-center text-sm py-6 text-base-content/60">
                No conversations yet... <br /> Pingguin is ready to break the
                ice!
              </p>
            )}

            {totalMessages.map((message, index) => (
              <div key={message._id}>
                <NewDayDisplay
                  curMessageTime={message.createdAt}
                  prevMessageTime={
                    index === 0 ? null : totalMessages[index - 1].createdAt
                  }
                />

                <div
                  className={`chat ${
                    message.senderId === authUser?._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                  ref={
                    index === totalMessages.length - 1 ? messageEndRef : null
                  }
                >
                  <div className="chat-image avatar">
                    <div className="size-9 rounded-full border border-neutral">
                      <img
                        src={
                          message.senderId === authUser?._id
                            ? authUser?.avatar || "/avatar.png"
                            : selectedUser?.avatar || "/avatar.png"
                        }
                        alt="Profile picture"
                      />
                    </div>
                  </div>

                  {index > 0 && (
                    <MessageTimeDisplay
                      curMessageTime={message.createdAt}
                      prevMessageTime={totalMessages[index - 1].createdAt}
                    />
                  )}

                  <div
                    className={`text-base max-w-4/5 md:max-w-2/3 lg:max-w-1/2 px-[10px] py-[5px] rounded-md ${
                      message.senderId === authUser?._id
                        ? "bg-secondary text-secondary-content rounded-br-none"
                        : "bg-base-200 rounded-bl-none"
                    }`}
                  >
                    {!!message.images?.length && (
                      <div
                        className={`flex flex-col gap-2 ${
                          message.messageText ? "mb-4" : ""
                        }`}
                      >
                        {message.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Attachment"
                            className="rounded-md"
                          />
                        ))}
                      </div>
                    )}
                    {message.messageText && <p>{message.messageText}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      <MessageInput setTotalMessages={setTotalMessages} />
    </div>
  );
}
