"use client";

import { Button, Modal } from "antd";
import moment from "moment";
import Image from "next/image";
import { useEffect } from "react";

export type INotification = {
  _id: string;
  sender?: {
    name?: string;
    profileImage?: string;
  };
  receiver: any;
  receiverEmail: string;
  receiverRole: "user" | "vendor" | "admin";
  fcmToken: string;
  type?:
    | "redeem"
    | "confirm-redeem"
    | "reject"
    | "cancelled"
    | "payment"
    | "accept";
  title?: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface NotificationModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  setIsNotificationRead: (open: boolean) => void;
  notificationData: INotification[];
  setLimit: any;
  isFetching: boolean;
}

const NotificationModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsNotificationRead,
  notificationData,
  setLimit,
  isFetching,
}: NotificationModalProps) => {
  useEffect(() => {
    // Check if there are unread notifications
    const hasUnread = notificationData?.some((item) => !item.isRead);
    setIsNotificationRead(hasUnread);
  }, [notificationData, setIsNotificationRead]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleLoadMore = () => {
    setLimit((prevLimit: number) => prevLimit + 5);
  };

  const handleRead = (id: string) => {
    // Ideally, call an API to mark notification as read
  };

  return (
    <Modal open={isModalOpen} onCancel={handleClose} footer={null}>
      <div className="p-6 max-h-[60vh] overflow-y-scroll">
        <h2 className="font-medium text-lg">Notifications</h2>
        <div className="border-t-2 border-gray-300 mt-6">
          {notificationData?.length > 0 ? (
            notificationData?.map((notification, index) => (
              <div
                key={notification._id}
                onClick={() => handleRead(notification._id)}
                className={`flex items-center gap-3 py-4 cursor-pointer ${
                  index !== 0 ? "border-t border-gray-300" : ""
                }`}
              >
                {notification?.sender?.profileImage && (
                  <Image
                    src={notification?.sender?.profileImage}
                    height={40}
                    width={40}
                    alt="Notification Profile Image"
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="text-gray-800">
                    <span className="font-medium">
                      {notification?.sender?.name || "User"}{" "}
                    </span>
                    <span>{notification?.message}</span>
                  </p>
                  <span className="text-gray-500 text-sm">
                    {notification?.updatedAt
                      ? moment(notification?.updatedAt).format(
                          "YYYY-MM-DD HH:mm"
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-5">No notifications</p>
          )}
        </div>
      </div>
      <Button
        className="w-full h-14 bg-gray-300 text-gray-700 text-lg font-medium mt-4"
        onClick={handleLoadMore}
        loading={isFetching}
      >
        See More
      </Button>
    </Modal>
  );
};

export default NotificationModal;
