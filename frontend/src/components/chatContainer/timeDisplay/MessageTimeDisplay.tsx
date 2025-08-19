import { formatDate } from "../../../lib/utils/helpers";

export default function MessageTimeDisplay({
  curMessageTime,
  prevMessageTime,
}: {
  curMessageTime: Date;
  prevMessageTime: Date;
}) {
  const diff =
    new Date(curMessageTime).getTime() - new Date(prevMessageTime).getTime();
  if (Math.floor(diff / (1000 * 60)) < 30) return null;

  return (
    <div className="chat-header mt-1 mb-2">
      <time className="text-xs text-zinc-500">
        {formatDate(curMessageTime, "time")}
      </time>
    </div>
  );
}
