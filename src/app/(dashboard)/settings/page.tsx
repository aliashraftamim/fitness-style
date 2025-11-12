"use client";

import ChangePasswordModal from "@/app/_components/modals/changePasswordModal/ChangePasswordModal";
import Link from "next/link";
import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";

const page = () => {
  const [open, setOpen] = useState(false);
  const [openResponsive, setOpenResponsive] = useState(false);
  

  return (
    <div className="h-screen pt-20 !pl-20">
      <div className="flex flex-col gap-[20px] max-w-[1026px] ">
        <Link
          href="/settings/personal-info"
          className="!text-zinc-900 !bg-white h-[64px] flex items-center justify-between px-[24px] rounded-[8px]"
        >
          <span> Personal Information</span> <FaAngleRight size={15} />
        </Link>
        <div
          onClick={() => setOpen(true)}
          className="!text-zinc-900 !bg-white h-[64px] flex items-center justify-between px-[24px] rounded-[8px] hover:cursor-pointer"
        >
          <span> Change Password</span> <FaAngleRight size={15} />
        </div>
        <Link
          href="/settings/terms-condition"
          className="!text-zinc-900 !bg-white h-[64px] flex items-center justify-between px-[24px] rounded-[8px] "
        >
          <span>Terms & Condition </span>
          <FaAngleRight size={15} />
        </Link>
        <Link
          href="/settings/privacy-policy"
          className="!text-zinc-900 !bg-white h-[64px] flex items-center justify-between px-[24px] rounded-[8px] "
        >
          <span>Privacy Policy</span> <FaAngleRight size={15} />
        </Link>
        <Link
          href="/settings/about-us"
          className="!text-zinc-900 !bg-white h-[64px] flex items-center justify-between px-[24px] rounded-[8px] "
        >
          <span> About Us</span> <FaAngleRight size={15} />
        </Link>
      </div>
      <ChangePasswordModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default page;
