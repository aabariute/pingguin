import { useState, type ChangeEvent } from "react";
import { GoMail, GoPencil, GoSmiley } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../../context/auth/useAuth";
import { useUser } from "../../context/user/useUser";
import DeleteAccountForm from "./DeleteAccountForm";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default function ProfileModal() {
  const { authUser } = useAuth();
  const { isLoading, updateAvatar } = useUser();

  const [selectedImg, setSelectedImg] = useState<string>("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateAvatar({ avatar: base64Image });
    };
  };

  function ClearModal() {
    setIsUpdatingPassword(false);
    setIsDeletingAccount(false);
  }

  return (
    <>
      <dialog id="profile_modal" className="modal">
        <div className="modal-box max-w-2xl max-h-[85dvh] overflow-y-auto p-6 border border-base-300 shadow-xl rounded-xl">
          <h3 className="text-xl font-bold text-center mb-6 text-primary">
            Profile
          </h3>

          <div className="modal-action absolute -top-0.5 right-[32px]">
            <form method="dialog" onSubmit={ClearModal}>
              <button className="btn btn-ghost btn-neutral btn-sm btn-circle">
                <IoCloseOutline className="size-5" />
              </button>
            </form>
          </div>

          <div className="md:flex md:items-center md:gap-10">
            <div className="mb-5 md:mb-0 flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="size-40 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${
                    isLoading.updateAvatar
                      ? "animate-pulse pointer-events-none"
                      : ""
                  }
                `}
                >
                  <GoPencil className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*;capture=camera"
                    capture="user"
                    onChange={(e) => handleImageUpload(e)}
                    disabled={isLoading.updateAvatar}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-base-content/50 flex items-center gap-2">
                    <GoSmiley className="h-4 w-4 text-base-content/40" />
                    Nickname
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-md">
                    {authUser?.nickname}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <GoMail className="h-4 w-4 text-base-content/40" />
                    Email Address
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-md">
                    {authUser?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isUpdatingPassword && !isDeletingAccount && (
            <div className="w-full flex flex-col-reverse md:flex-row md:justify-between gap-4 md:gap-12 mt-16">
              <button
                className="btn btn-outline btn-error btn-block md:btn-wide"
                onClick={() => setIsDeletingAccount(true)}
              >
                Delete Account
              </button>
              <button
                className="btn btn-neutral btn-block md:btn-wide"
                onClick={() => setIsUpdatingPassword(true)}
              >
                Change Password
              </button>
            </div>
          )}

          {isUpdatingPassword && (
            <UpdatePasswordForm setIsUpdatingPassword={setIsUpdatingPassword} />
          )}

          {isDeletingAccount && (
            <DeleteAccountForm setIsDeletingAccount={setIsDeletingAccount} />
          )}
        </div>

        <form method="dialog" className="modal-backdrop" onSubmit={ClearModal}>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
