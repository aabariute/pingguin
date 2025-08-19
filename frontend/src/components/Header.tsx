import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="py-3 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2 text-primary">
        <span className="text-xl" role="img">
          🐧
        </span>
        <h1 className="text-xl font-semibold tracking-wide">Pingguin</h1>
      </div>

      <Navbar />
    </header>
  );
}
