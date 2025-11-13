"use client";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { BiLogOut } from "react-icons/bi";

const LogoutMenuItem = () => {
  const mutation = useAppDispatch();

  const handleLogout = async () => {
    try {
      await mutation(logout());
      // Optional: redirect or toast
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 cursor-pointer"
    >
      <BiLogOut size={22} color="red" />
      <span>Logout</span>
    </div>
  );
};

export default LogoutMenuItem;
