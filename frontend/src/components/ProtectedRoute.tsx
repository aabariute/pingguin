import { useEffect } from "react";
import { TbLoader2 } from "react-icons/tb";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, verifyAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading.verifyAuth) navigate("/login");
    },
    [isAuthenticated, isLoading.verifyAuth, navigate]
  );

  if (isLoading.verifyAuth) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <TbLoader2 className="size-24 animate-spin text-secondary" />
      </div>
    );
  }

  if (isAuthenticated) return <Outlet />;
}
