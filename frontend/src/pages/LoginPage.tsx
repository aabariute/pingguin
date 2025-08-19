import axios from "axios";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoKey, GoMail, GoSmiley } from "react-icons/go";
import { LuLoaderCircle } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useAuth } from "../context/auth/useAuth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [isUsingEmail, setIsUsingEmail] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const identifierType = isUsingEmail ? "email" : "nickname";

    try {
      await login(identifierType, formData.identifier, formData.password);
      navigate("/", { replace: true });
      toast.success("Logged in succesfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        console.error(error);
      }
      setFormData({ identifier: "", password: "" });
    }
  };

  return (
    <Container maxWidth="max-w-xl">
      <div className="text-center mb-10">
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl bg-accent/40 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl" role="img">
              🐧
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 uppercase">Welcome back</h1>
          <p className="text-base-content/70">Sign in to your account</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="w-full space-y-6">
        <label className="label flex justify-between text-base-content/80">
          Sign in with nickname
          <input
            type="checkbox"
            className="toggle"
            checked={!isUsingEmail}
            onChange={(e) => setIsUsingEmail(!e.target.checked)}
          />
        </label>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base">
            {isUsingEmail ? "Email" : "Nickname"}
          </legend>
          <label className="input w-full gap-x-3">
            <span>
              {isUsingEmail ? (
                <GoMail className="h-4 w-4 text-base-content/40" />
              ) : (
                <GoSmiley className="h-4 w-4 text-base-content/40" />
              )}
            </span>
            <input
              type={isUsingEmail ? "email" : "text"}
              required
              autoComplete={isUsingEmail ? "email" : "nickname"}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder={isUsingEmail ? "pingguin@mail.com" : "pingguin_123"}
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
            />
          </label>

          <legend className="fieldset-legend text-base">Password</legend>
          <label className="input w-full gap-x-3">
            <span>
              <GoKey className="h-4 w-4 text-base-content/40" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="password"
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-base-content/40" />
              ) : (
                <FaEye className="h-5 w-5 text-base-content/40" />
              )}
            </button>
          </label>
        </fieldset>

        <button
          type="submit"
          className="btn btn-secondary w-full"
          disabled={isLoading.login}
        >
          {isLoading.login ? (
            <>
              <LuLoaderCircle className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="pt-3 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="link link-secondary">
          Sign up.
        </Link>
      </p>
    </Container>
  );
}
