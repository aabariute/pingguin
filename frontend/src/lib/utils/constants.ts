import type { Theme } from "../../context/chat/ChatContext";

export const MESSAGES_PER_PAGE = 15;
export const DEFAULT_SIDEBAR_POSITION = "vertical";
export const DEFAULT_THEME: Theme = { mode: "dark", theme: "dracula" };
export const THEMES = {
  light: [
    {
      value: "emerald",
      name: "Lemon Drift",
    },
    {
      value: "winter",
      name: "Polar Day",
    },
    {
      value: "nord",
      name: "Snow Light",
    },
    {
      value: "autumn",
      name: "Peach Breeze",
    },
  ],
  dark: [
    {
      value: "night",
      name: "Aurora Night",
    },
    {
      value: "dracula",
      name: "Frozen Soda",
    },
    {
      value: "dark",
      name: "Midnight Ice",
    },
    {
      value: "sunset",
      name: "Shadow Frost",
    },
  ],
};
