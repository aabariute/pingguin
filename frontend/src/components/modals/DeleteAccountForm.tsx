import axios from "axios";
import { useState, type Dispatch, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user/useUser";

export default function DeleteAccountForm({
  setIsDeletingAccount,
}: {
  setIsDeletingAccount: Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { isLoading, deleteAccount } = useUser();
  const [passwordCurrent, setPasswordCurrent] = useState<string>("");

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordCurrent) return;

    try {
      await deleteAccount(passwordCurrent);
      navigate("/login");
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
    <div>
      <p className="text-xs mt-14 mb-6 text-base-content/80">
        Caution! After your account is deleted, you will no longer have access
        to your chat history or any other personalized data associated with your
        account. This action is permanent and cannot be undone. Enter your
        current password to proceed with account deletion.
      </p>

      <form onSubmit={handleDeleteAccount} className="flex flex-col gap-y-2 ">
        <div className="grid items-center gap-y-1.5 gap-x-5 md:grid-cols-[1fr_3fr]">
          <span>Current Password</span>
          <input
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={passwordCurrent}
            onChange={(e) => setPasswordCurrent(e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="btn btn-neutral"
            type="button"
            onClick={() => {
              setIsDeletingAccount(false);
              setPasswordCurrent("");
            }}
          >
            Cancel
          </button>

          <button className="btn btn-error" type="submit">
            {isLoading.deleteAccount ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
}
