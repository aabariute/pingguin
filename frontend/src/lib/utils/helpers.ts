import axios from "axios";

export type DateFormatType = "time" | "dayTime" | "full";

export const logError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    console.error(error.response);
  } else {
    console.error(error);
  }
};

export const generateNicknameSuggestions = (
  nickname: string
): Array<string> => {
  const randomNum = () => Math.floor(Math.random() * 1000);

  return [
    `${nickname}${randomNum()}`,
    `${nickname}_${randomNum()}`,
    `${nickname}.${randomNum()}`,
  ];
};

export const formatDate = (
  date: string | number | Date,
  formatType: DateFormatType = "time"
): string => {
  const d = new Date(date);

  switch (formatType) {
    case "time": {
      // Format: 20:05
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    case "dayTime": {
      // Format: 13:08, Mon
      const time = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      return `${time}, ${weekday}`;
    }

    case "full": {
      // Format: 2025-07-26 20:03
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    default:
      return d.toISOString();
  }
};

export function getRelativeTime(dateString: string | Date): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const YEAR = 365.25 * DAY;

  if (diffMs < MINUTE) {
    return "Now";
  } else if (diffMs < HOUR) {
    const minutes = Math.floor(diffMs / MINUTE);
    return `${minutes} min.`;
  } else if (diffMs < DAY) {
    const hours = Math.floor(diffMs / HOUR);
    return `${hours} h.`;
  } else if (diffMs < WEEK) {
    const days = Math.floor(diffMs / DAY);
    return `${days} d.`;
  } else if (diffMs < YEAR) {
    const weeks = Math.floor(diffMs / WEEK);
    return `${weeks} w.`;
  } else {
    const years = Math.floor(diffMs / YEAR);
    return `${years} y.`;
  }
}
