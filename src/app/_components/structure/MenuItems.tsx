"use client";

import Link from "next/link";
import { BiSupport } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";
import { FaUserShield } from "react-icons/fa6";
import { IoSettingsOutline, IoVideocamOutline } from "react-icons/io5";
import { LiaAwardSolid } from "react-icons/lia";
import { MdOutlineSubscriptions } from "react-icons/md";
import { RiBarChart2Line } from "react-icons/ri";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import LogoutMenuItem from "../MAIN/logout-component/Logout";

export const sidebarMenuItems = [
  {
    key: "/dashboard",
    icon: <TbLayoutDashboardFilled size={22} />,
    label: <Link href="/">Dashboard</Link>,
  },
  {
    key: "/users",
    icon: <FaUserShield size={22} />,
    label: <Link href="/users">Users</Link>,
  },
  {
    key: "/tiers",
    icon: <RiBarChart2Line size={22} />,
    label: <Link href="/tiers">Tiers</Link>,
  },
  {
    key: "/subscription",
    icon: <CiBadgeDollar size={22} />,
    label: "Subscription",
    children: [
      {
        key: "/subscription/main",
        icon: <MdOutlineSubscriptions size={22} />,
        label: <Link href="/subscription">Plans</Link>,
      },
      {
        key: "/subscription/users",
        icon: <FaUserShield size={22} />,
        label: <Link href="/subscription/users">Users</Link>,
      },
    ],
  },
  {
    key: "/badge-management",
    icon: <LiaAwardSolid size={22} />,
    label: <Link href="/badge-management">Badge Management</Link>,
  },

  {
    key: "/video-content",
    icon: <IoVideocamOutline size={22} />,
    label: <Link href="/video-content">Video Content</Link>,
  },

  {
    key: "/customer-support",
    icon: <BiSupport size={22} />,
    label: (
      <Link href="/customer-support" legacyBehavior>
        Customer Support
      </Link>
    ),
  },
  {
    key: "/settings",
    icon: <IoSettingsOutline size={22} />,
    label: <Link href="/settings">Settings</Link>,
  },
  {
    key: "/logout",
    label: (
      <div onClick={() => {}}>
        {/* <span className="text-red-500">Logouts</span> */}
        <LogoutMenuItem />
      </div>
    ),
  },
];
