import { formatDate } from "../../../lib/utils/helpers";

export default function NewDayDisplay({
  curMessageTime,
  prevMessageTime,
}: {
  curMessageTime: Date;
  prevMessageTime: null | Date;
}) {
  if (!prevMessageTime)
    return (
      <div className="text-center mt-6">
        <time className="text-sm text-zinc-500">
          {formatDate(curMessageTime, "full")}
        </time>
      </div>
    );

  const diff =
    new Date(curMessageTime).getDate() - new Date(prevMessageTime).getDate();
  if (diff < 1) return null;

  return (
    <div className="text-center mt-6">
      <time className="text-sm text-zinc-500">
        {diff >= 7
          ? formatDate(curMessageTime, "full")
          : formatDate(curMessageTime, "dayTime")}
      </time>
    </div>
  );
}
