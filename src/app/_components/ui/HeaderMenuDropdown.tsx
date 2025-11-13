"use client";

import { useGetMeQuery } from "@/redux/features/admin/admin.api";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../users/user.interface";

const HeaderMenuDropdown = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser: IUser | null | any = useAppSelector(selectCurrentUser);

  const { data: user, isLoading } = useGetMeQuery(undefined);

  const [loggedInUser, setLoggedInUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Set logged in user when API data is fetched
  useEffect(() => {
    if (user?.data) {
      setLoggedInUser(user.data);
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    loggedInUser?.firstName ?? currentUser?.firstName ?? "Admin";
  const displayImage =
    loggedInUser?.profileImage ??
    currentUser?.profileImage ??
    "https://res.cloudinary.com/dyalzfwd4/image/upload/v1738207704/user_wwrref.png";

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50">
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-2xl border-2 px-4 py-2 transition bg-white shadow-sm hover:shadow-md"
      >
        <span className="font-semibold text-sm">{displayName}</span>
        <Image
          src={displayImage}
          height={32}
          width={32}
          alt="Profile"
          className="w-8 h-8 rounded-full border-brand-primary object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
          <ul className="py-2 text-sm">
            <li>
              <Link
                href="/settings/personal-info"
                className="block px-4 py-2 hover:bg-brand-primary"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  dispatch(logout());
                  router.push("/login");
                }}
                style={{ color: "red" }}
                className="w-full text-left px-4 py-2 hover:bg-brand-primary font-semibold"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderMenuDropdown;
