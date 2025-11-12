"use client";

import {
  useBlockUserMutation,
  useGetAllUsersQuery,
  useUnblockUserMutation,
} from "@/redux/features/admin/users.api";
import { EyeOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Avatar, Modal, Space, Table, Tooltip } from "antd";
import React, { useState } from "react";
import { GoBlocked } from "react-icons/go";
import { toast } from "sonner";
import { IUser } from "../users/user.interface";

interface DataType {
  key: React.Key;
  serial: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: string;
  address: string;
  createdAt: Date | string;
  avatar: string;
  action: React.ReactNode;
}

const RecentUser: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataType | null>(null);

  // Block / Unblock handling
  const [actionUser, setActionUser] = useState<DataType | null>(null);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [unblockModalVisible, setUnblockModalVisible] = useState(false);

  const { data: recentUsers } = useGetAllUsersQuery({ limit: 2 });
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  // Open user details modal
  const handleViewUser = (user: DataType) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Open block/unblock confirmation modals
  const handleBlockUser = (user: DataType) => {
    setActionUser(user);
    setBlockModalVisible(true);
  };

  const handleUnblockUser = (user: DataType) => {
    setActionUser(user);
    setUnblockModalVisible(true);
  };

  // Confirm block
  const confirmBlockUser = async () => {
    if (actionUser) {
      try {
        await blockUser(actionUser.key).unwrap();
        toast.success("User blocked successfully");
        setBlockModalVisible(false);
        setActionUser(null);
      } catch (err) {
        toast.error("Failed to block user");
      }
    }
  };

  // Confirm unblock
  const confirmUnblockUser = async () => {
    if (actionUser) {
      try {
        await unblockUser(actionUser.key).unwrap();
        toast.success("User unblocked successfully");
        setUnblockModalVisible(false);
        setActionUser(null);
      } catch (err) {
        toast.error("Failed to unblock user");
      }
    }
  };

  // Table columns
  const columns: TableColumnsType<DataType> = [
    {
      title: "Serial",
      dataIndex: "serial",
      render: (text) => <span className="pl-4">{text}</span>,
      width: "10%",
      align: "center",
    },
    {
      title: "Full Name",
      dataIndex: "name",
      render: (text, record) => (
        <Space className="justify-start flex w-full">
          <Avatar src={record.avatar || "/default-avatar.png"} size={32} />
          {text}
        </Space>
      ),
      width: "25%",
      align: "start",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "25%",
      align: "start",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      align: "start",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: "20%",
      align: "center",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "10%",
      align: "center",
    },
  ];

  // Table data
  const dataSource: DataType[] = recentUsers?.data?.map(
    (user: IUser, index: number) => {
      const userData: DataType = {
        key: user._id,
        serial: `#${(index + 1).toString().padStart(2, "0")}`,
        name: user.firstName,
        email: user.email,
        phoneNumber: user.contactNumber,
        status: user.status,
        address: user.locationName,
        createdAt: user.createdAt,
        avatar:
          user.profileImage ||
          "https://res.cloudinary.com/dhp4mffqp/image/upload/v1740493576/man-2_scexda.png",
        action: <></>,
      };

      userData.action = (
        <div className="flex items-center justify-center space-x-2">
          <Tooltip title="View Details">
            <EyeOutlined
              onClick={() => handleViewUser(userData)}
              className="text-lg cursor-pointer"
            />
          </Tooltip>
          {user.status === "BLOCKED" ? (
            <Tooltip title="Unblock User">
              <GoBlocked
                color="green"
                className="text-lg cursor-pointer"
                onClick={() => handleUnblockUser(userData)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Block User">
              <GoBlocked
                color="red"
                className="text-lg cursor-pointer"
                onClick={() => handleBlockUser(userData)}
              />
            </Tooltip>
          )}
        </div>
      );

      return userData;
    }
  );

  const components = {
    header: {
      cell: (props: any) => (
        <th
          {...props}
          className="bg-red-600 text-white text-center font-semibold py-3"
        >
          {props.children}
        </th>
      ),
    },
  };

  return (
    <div className="py-5 pt-10">
      <div className="py-[10px] rounded-[20px] bg-[#F5F5F5] overflow-hidden">
        <Table<DataType>
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          style={{ borderRadius: "20px", overflow: "hidden" }}
          components={components}
        />
      </div>

      {/* User Details Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={440}
        className="mt-32 userInfoModal"
        centered
      >
        {selectedUser && (
          <div className="space-y-2">
            <h4 className="text-center text-[16px] mb-5">User Details</h4>
            {[
              {
                label: "Date",
                value: new Date(selectedUser.createdAt).toLocaleString(),
              },
              { label: "User Name", value: selectedUser.name },
              { label: "Email", value: selectedUser.email },
              { label: "Phone Number", value: selectedUser.phoneNumber },
              { label: "Address", value: selectedUser.address },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between border-b py-3">
                <span className="font-semibold">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Block Confirmation Modal */}
      <Modal
        open={blockModalVisible}
        onCancel={() => setBlockModalVisible(false)}
        onOk={confirmBlockUser}
        okText="Block"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
        width={300}
        closable={false}
      >
        {actionUser && (
          <p className="text-center">
            Are you sure you want to block <strong>{actionUser.name}</strong>?
          </p>
        )}
      </Modal>

      {/* Unblock Confirmation Modal */}
      <Modal
        open={unblockModalVisible}
        onCancel={() => setUnblockModalVisible(false)}
        onOk={confirmUnblockUser}
        okText="Unblock"
        cancelText="Cancel"
        okButtonProps={{ type: "primary" }}
        centered
        width={300}
        closable={false}
      >
        {actionUser && (
          <p className="text-center">
            Are you sure you want to unblock <strong>{actionUser.name}</strong>?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default RecentUser;
