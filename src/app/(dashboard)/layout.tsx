"use client";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Button, Layout, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { RiNotification3Line } from "react-icons/ri";
import SiderMenu from "../_components/structure/SiderMenu";
import HeaderMenuDropdown from "../_components/ui/HeaderMenuDropdown";

const { Header, Sider, Content } = Layout;

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false); // Fix: Use state to trigger re-render
  const router = useRouter();

  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    router.push("/login");
    router.refresh();
  }

  const handleModalOpen = async () => {
    setIsModalOpen(true);

    // await readAllNotification(undefined);
    // refetch();
    setHasNewNotification(false); // ✅ Reset badge after opening modal
  };

  useEffect(() => {
    setMounted(true); // prevent SSR mismatch
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!mounted) {
    return null;
  } // avoid hydration error

  // Example years from 2020 to current year
  const yearOptions = [];
  for (let y = 2020; y <= new Date().getFullYear(); y++) {
    yearOptions.push(y);
  }

  return (
    <Layout hasSider className="h-screen overflow-hidden mx-auto">
      <SiderMenu collapsed={collapsed} />

      <Layout className="h-screen">
        <Header
          style={{
            background: "white",
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex justify-between items-center w-full gap-5 bg-amber-30">
            <Button
              type="text"
              icon={
                collapsed ? <IoMdClose size={36} /> : <IoIosMenu size={36} />
              }
              onClick={() => setCollapsed(!collapsed)}
              className="flex max-h-[0px] items-center justify-center transition-all duration-300 bg-cyan-30"
            />
            <div className=" leading-6 w-full flex items-center justify-between gap-10 bg-indigo-40">
              <div>
                <h4 className="text-[24px]">Welcome, James</h4>
                <p className="text-[16px] leading-0">Have a nice day!</p>
              </div>

              <div className="flex items-center gap-4 relative">
                {/* Notification Button (Fixed Badge) */}
                <div
                  onClick={() => handleModalOpen()}
                  className="bg-zinc-200  p-2 rounded-full relative hover:cursor-pointer"
                >
                  {hasNewNotification && (
                    <span className="bg-brand-primary size-3 rounded-full absolute right-0 top-0"></span>
                  )}
                  <Link href="/notification">
                    <RiNotification3Line className="text-zinc-900" size={25} />
                  </Link>

                  <div className="size-3 bg-brand-primary rounded-full absolute top-0 right-0"></div>
                </div>

                {/* User Menu */}
                <HeaderMenuDropdown />
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "calc(100vh - 200px)", // adjusted for Header height
            overflowY: "auto",
          }}
        >
          <div className="bg-zinc-50 h-auto px-5 ">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
