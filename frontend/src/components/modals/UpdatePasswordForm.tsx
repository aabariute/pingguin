import axios from "axios";
import { useState, type Dispatch, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { ChangePassword } from "../../context/user/UserContext";
import { useUser } from "../../context/user/useUser";

export default function UpdatePasswordForm({
  setIsUpdatingPassword,
}: {
  setIsUpdatingPassword: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isLoading, updatePassword } = useUser();
  const [formData, setFormData] = useState<ChangePassword>({
    passwordCurrent: "",
    passwordNew: "",
    passwordConfirm: "",
  });

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.passwordCurrent ||
      !formData.passwordNew ||
      !formData.passwordConfirm
    ) {
      return;
    }

    if (formData.passwordNew !== formData.passwordConfirm) {
      setFormData((prev) => ({
        ...prev,
        passwordNew: "",
        passwordConfirm: "",
      }));
      return toast.error("Password does not match!");
    }

    try {
      await updatePassword(formData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response);
        toast.error(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleUpdatePassword}
      className="flex flex-col gap-y-2 mt-14"
    >
      <div className="grid items-center gap-y-1.5 gap-x-5 md:grid-cols-[1fr_3fr]">
        <span>Current Password</span>
        <input
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          value={formData.passwordCurrent}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              passwordCurrent: e.target.value,
            }))
          }
          className="input w-full"
        />
      </div>
      <div className="grid items-center gap-y-1.5 gap-x-5 md:grid-cols-[1fr_3fr]">
        <span>New Password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={formData.passwordNew}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              passwordNew: e.target.value,
            }))
          }
          className="input w-full"
        />
      </div>
      <div className="grid items-center gap-y-1.5 gap-x-5 md:grid-cols-[1fr_3fr]">
        <span>Confirm Password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={formData.passwordConfirm}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              passwordConfirm: e.target.value,
            }))
          }
          className="input w-full"
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="btn btn-neutral"
          type="button"
          onClick={() => {
            setIsUpdatingPassword(false);
            setFormData({
              passwordCurrent: "",
              passwordNew: "",
              passwordConfirm: "",
            });
          }}
        >
          Cancel
        </button>
        <button className="btn btn-accent" type="submit">
          {isLoading.updatePassword ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}
