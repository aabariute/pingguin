import { IoCloseOutline } from "react-icons/io5";
import type { DarkTheme, LightTheme } from "../../context/chat/ChatContext";
import { useChat } from "../../context/chat/useChat";
import { THEMES } from "../../lib/utils/constants";

export default function ThemeModal() {
  const { light: lightThemes, dark: darkThemes } = THEMES;

  return (
    <dialog id="theme_modal" className="modal fixed top-0 z-50">
      <div className="modal-box max-w-2xl p-6 border border-base-300 shadow-xl rounded-xl">
        <h3 className="text-xl font-bold text-center mb-1 text-primary">
          ❄️ Choose Your Theme ❄️
        </h3>
        <p className="text-sm text-center text-zinc-500 mb-6">
          Personalize your Pingguin experience
        </p>

        <div className="modal-action absolute -top-0.5 right-[32px]">
          <form method="dialog">
            <button className="btn btn-ghost btn-neutral btn-sm btn-circle">
              <IoCloseOutline className="size-5" />
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Light Themes</h4>
            <ul className="grid grid-cols-4 gap-2">
              {lightThemes.map((theme) => (
                <ThemeCard key={theme.value} theme={theme} mode="light" />
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Dark Themes</h4>
            <ul className="grid grid-cols-4 gap-2">
              {darkThemes.map((theme) => (
                <ThemeCard key={theme.value} theme={theme} mode="dark" />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

const ThemeCard = ({
  theme,
  mode,
}: {
  theme: { value: string; name: string };
  mode: string;
}) => {
  const { theme: selectedTheme, setTheme } = useChat();

  return (
    <li
      className={`p-3 rounded-lg bg-base-100 border border-zinc-700 hover:border-primary hover:shadow-md transition cursor-pointer ${
        theme.value === selectedTheme.theme ? "ring-2 ring-primary" : ""
      }`}
      data-theme={theme.value}
      onClick={() =>
        setTheme({ mode, theme: theme.value } as LightTheme | DarkTheme)
      }
    >
      <div className="flex justify-center">
        <div className="grid grid-cols-2 h-12 w-12 gap-1 mb-2">
          <div className="bg-primary rounded" />
          <div className=" bg-secondary rounded" />
          <div className="bg-accent rounded" />
          <div className=" bg-neutral rounded" />
        </div>
      </div>

      <p className="text-sm text-center">{theme.name}</p>
    </li>
  );
};
