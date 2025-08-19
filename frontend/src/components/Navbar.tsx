import { FaPaintRoller } from "react-icons/fa6";
import { IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center gap-4">
      {/* Opens theme modal */}
      <button
        onClick={() => {
          const modal = document.getElementById(
            "theme_modal"
          ) as HTMLDialogElement | null;
          modal?.showModal();
        }}
        className="cursor-pointer"
        title="Change theme"
      >
        <FaPaintRoller className="size-5 hover:opacity-80" />
      </button>

      {/* Opens profile modal */}
      <button
        onClick={() => {
          const modal = document.getElementById(
            "profile_modal"
          ) as HTMLDialogElement | null;
          modal?.showModal();
        }}
        className="cursor-pointer"
        title="Change theme"
      >
        <IoPersonCircleOutline className="size-7 hover:opacity-80" />
      </button>

      {/* Logout button */}
      <button onClick={handleLogout} className="cursor-pointer" title="Logout">
        <IoLogOutOutline className="size-7 hover:opacity-80" />
      </button>
    </nav>
  );
}
