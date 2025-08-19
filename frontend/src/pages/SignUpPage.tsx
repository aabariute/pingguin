import axios from "axios";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { GoKey, GoMail, GoSmiley } from "react-icons/go";
import { LuLoaderCircle } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useAuth } from "../context/auth/useAuth";
import { generateNicknameSuggestions } from "../lib/utils/helpers";

export default function SignUpPage() {
  const { signup, isNicknameAvailable, isLoading } = useAuth();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [nicknameSuggestions, setNicknameSuggestions] = useState<Array<string>>(
    []
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();

  const handleNicknameCheck = async (nickname: string) => {
    if (!nickname || nickname.trim().length < 5) {
      setIsAvailable(true); // let daisyUI validator handle validation error
      setNicknameSuggestions([]);
      return;
    }

    const success = await isNicknameAvailable({ nickname });
    setIsAvailable(success);

    const suggestions = success ? [] : generateNicknameSuggestions(nickname);
    setNicknameSuggestions(suggestions);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signup(formData);
      navigate("/", { replace: true });
      toast.success("Signed up succesfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Signup failed");
      } else {
        console.error(error);
      }
      setFormData({
        email: "",
        nickname: "",
        password: "",
        passwordConfirm: "",
      });
    }
  };

  return (
    <Container maxWidth="max-w-xl">
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl bg-accent/40 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl" role="img">
              🐧
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 uppercase">Create account</h1>
          <p className="text-base-content/70">
            Get started with your free account
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <fieldset className="fieldset">
          <div className="mb-4">
            <legend className="fieldset-legend text-base">Email</legend>
            <label className="input validator w-full gap-x-3">
              <span>
                <GoMail className="h-4 w-4 text-base-content/40" />
              </span>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="pingguin@mail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </label>
            <p className="validator-hint hidden my-1">
              Enter valid email address
            </p>
            <p className="text-xs text-base-content/70 mt-1">
              * We&apos;ll only use your email to help you log in securely. It
              won&apos;t be shared or visible to other users in the app.
            </p>
          </div>

          <div>
            <legend className="fieldset-legend text-base">Nickname</legend>
            <label
              className={`input w-full gap-x-3 ${
                isAvailable ? "validator" : "input-error"
              }`}
            >
              <span>
                <GoSmiley className="h-4 w-4 text-base-content/40" />
              </span>
              <input
                type="text"
                required
                placeholder="pingguin_123"
                autoComplete="new-nickname"
                autoCapitalize="off"
                autoCorrect="off"
                minLength={5}
                maxLength={12}
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                onBlur={() => handleNicknameCheck(formData.nickname)}
                disabled={isLoading.verifyNickname}
              />
              {isLoading.verifyNickname && (
                <span>
                  <FaSpinner className="h-4 w-4 text-base-content/40 animate-spin" />
                </span>
              )}
            </label>
            <p className="validator-hint hidden mt-1">
              Nickname must have between 5 and 12 characters.
            </p>

            {!isAvailable && nicknameSuggestions.length > 0 && (
              <div className="text-xs text-base-content/70 mt-1">
                <span className="text-error">
                  Oops! That nickname is already taken.{" "}
                </span>
                <span>
                  Please try another one or choose from the suggestions:
                </span>
                <div className="text-base-content/80 flex flex-col mt-1">
                  {nicknameSuggestions.map((nick, i) => (
                    <span
                      key={i}
                      className="font-medium cursor-pointer hover:underline hover:text-base-content"
                      onClick={() => {
                        setFormData({ ...formData, nickname: nick });
                        handleNicknameCheck(nick);
                      }}
                    >
                      {nick}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <legend className="fieldset-legend text-base">Password</legend>
            <label className="input validator w-full gap-x-3">
              <span>
                <GoKey className="h-4 w-4 text-base-content/40" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                autoCapitalize="off"
                autoCorrect="off"
                placeholder="••••••••"
                value={formData.password}
                minLength={8}
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
            <p className="validator-hint hidden mt-1">
              Password must contain at least 8 characters
            </p>
          </div>

          <div>
            <legend className="fieldset-legend text-base">
              Confirm password
            </legend>
            <label className="input validator w-full gap-x-3">
              <span>
                <GoKey className="h-4 w-4 text-base-content/40" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                autoCapitalize="off"
                autoCorrect="off"
                placeholder="••••••••"
                value={formData.passwordConfirm}
                minLength={8}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passwordConfirm: e.target.value,
                  })
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
            <p className="validator-hint hidden mt-1">
              Password must contain at least 8 characters
            </p>
          </div>
        </fieldset>

        <button
          type="submit"
          className="btn btn-secondary w-full"
          disabled={isLoading.signup || !isAvailable}
        >
          {isLoading.signup ? (
            <>
              <LuLoaderCircle className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="pt-3 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="link link-secondary">
          Sign in
        </Link>
      </p>
    </Container>
  );
}
