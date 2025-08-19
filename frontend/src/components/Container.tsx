import { useChat } from "../context/chat/useChat";

export default function Container({
  px = "px-8",
  py = "py-10",
  maxWidth = "max-w-xl",
  children,
}: {
  px?: string;
  py?: string;
  maxWidth: string;
  children: React.ReactNode;
}) {
  const { theme } = useChat();

  return (
    <div className={`relative w-full h-full ${maxWidth}`}>
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl blur-xl bg-gradient-to-tr from-primary/40 via-secondary/40 to-accent/40" />
      <div
        className={`relative h-full overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl ${px} ${py} ${
          theme.mode === "light"
            ? "border-white/20 bg-white/10"
            : "border-white/10 bg-black/30"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
