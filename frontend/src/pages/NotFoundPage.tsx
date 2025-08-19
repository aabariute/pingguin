import { useNavigate } from "react-router-dom";
import Container from "../components/Container";

export default function PingguinNotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="max-w-xl">
      <section className="flex flex-col items-center text-center">
        <h1 className="text-7xl font-extrabold leading-none select-none bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          404
        </h1>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold">
          Page not found
        </h2>
        <p className="mt-4">
          This iceberg looks empty. The page you&apos;re looking for has drifted
          away.
        </p>

        <span
          className="mt-8 text-6xl motion-safe:animate-bounce"
          role="img"
          aria-label="Penguin"
        >
          🐧
        </span>

        <nav className="mt-12 flex items-center justify-center gap-6 w-full">
          <button
            onClick={() => navigate(-1)}
            className="btn flex-1 btn-primary btn-outline cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn flex-1 btn-soft btn-primary cursor-pointer"
          >
            Open Pingguin
          </button>
        </nav>
      </section>
    </Container>
  );
}
