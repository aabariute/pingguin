export default function StartChat() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-14">
      <div className="flex items-center justify-center text-center text-xl md:text-2xl font-light">
        <p>
          Choose a friend and start chatting — <br /> this penguin doesn&apos;t
          like the cold silence!
        </p>
      </div>

      <div className="flex items-end justify-center gap-2 lg:gap-6 flex-wrap">
        <img
          src="penguin1.png"
          alt="penguin"
          className="w-36 sm:w-40 md:w-48 lg:w-56 h-auto object-contain"
        />
        <img
          src="penguin2.png"
          alt="penguin"
          className="w-36 sm:w-40 md:w-48 lg:w-56 h-auto object-contain"
        />
      </div>
    </div>
  );
}
