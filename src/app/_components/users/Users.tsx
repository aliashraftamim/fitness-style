"use client";

import {
  useBlockUserMutation,
  useGetAllUsersQuery,
  useUnblockUserMutation,
} from "@/redux/features/admin/users.api";
import { EyeOutlined } from "@ant-design/icons";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { Avatar, Modal, Space, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { GoBlocked } from "react-icons/go";
import { MdLockOpen } from "react-icons/md";
import { toast } from "sonner";
import { IUser, USER_STATUS } from "./user.interface";

const User: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [unblockModalVisible, setUnblockModalVisible] = useState(false);
  const [actionUser, setActionUser] = useState<IUser | null>(null);
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, error, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const meta = data?.meta;
  const allUsers = data.data;

  const handleViewUser = (user: IUser) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleBlockUser = (user: IUser) => {
    setActionUser(user);
    setBlockModalVisible(true);
  };

  const handleUnblockUser = (user: IUser) => {
    setActionUser(user);
    setUnblockModalVisible(true);
  };

  const confirmBlockUser = async () => {
    if (actionUser) {
      try {
        await blockUser(actionUser._id).unwrap();
        toast.success("User blocked successfully");
        setBlockModalVisible(false);
        setActionUser(null);
      } catch (error) {
        toast.error("Failed to block user");
      }
    }
  };

  const confirmUnblockUser = async () => {
    if (actionUser) {
      try {
        await unblockUser(actionUser._id).unwrap();
        toast.success("User unblocked successfully");
        setUnblockModalVisible(false);
        setActionUser(null);
      } catch (error) {
        toast.error("Failed to unblock user");
      }
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const columns: TableColumnsType<IUser> = [
    {
      title: "Serial",
      dataIndex: "serial",
      width: "10%",
      align: "center",
      render: (text) => <span className="pl-4">{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "firstName",
      width: "20%",
      align: "start",
      render: (text, record) => (
        <Space className="justify-start flex w-full">
          <Avatar
            src={record.profileImage || "/default-avatar.png"}
            size={32}
          />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
      align: "start",
    },
    {
      title: "Phone Number",
      dataIndex: "contactNumber",
      width: "20%",
      align: "start",
    },
    {
      title: "Tiers",
      dataIndex: "payment",
      width: "10%",
      align: "start",
      render: (payment) => (
        <span className="pl-4">
          {payment?.tiersId?.name || payment?.tiersName || "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      align: "center",
      render: (status: keyof typeof USER_STATUS) => {
        console.log("🚀 ~ User ~ status:", status);
        return (
          <Tag color={status === USER_STATUS.BLOCKED ? "red" : "green"}>
            {status === USER_STATUS.BLOCKED ? "Blocked" : "Active"}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: "15%",
      align: "center",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center space-x-2">
          <Tooltip title="View Details">
            <EyeOutlined
              onClick={() => handleViewUser(record)}
              className="text-lg cursor-pointer"
            />
          </Tooltip>
          {record.status === USER_STATUS.BLOCKED ? (
            <Tooltip title="Unblock User">
              <MdLockOpen
                color="green"
                className="text-lg cursor-pointer"
                onClick={() => handleUnblockUser(record)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Block User">
              <GoBlocked
                color="red"
                className="text-lg cursor-pointer"
                onClick={() => handleBlockUser(record)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

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
        <Table<IUser>
          columns={columns}
          dataSource={allUsers}
          components={components}
          style={{ borderRadius: "20px", overflow: "hidden" }}
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            position: ["bottomCenter"],
            className: "mt-4",
            showQuickJumper: true,
            locale: {
              items_per_page: "/ page",
              jump_to: "Go to",
              page: "",
            },
          }}
        />
      </div>

      {/* View User Modal */}
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
              { label: "User Name", value: selectedUser.firstName },
              { label: "Email", value: selectedUser.email },
              { label: "Phone Number", value: selectedUser.contactNumber },
              {
                label: "Tiers",
                value:
                  selectedUser.payment?.tiersId?.name ??
                  selectedUser.payment?.tiersName ??
                  "N/A",
              },
              { label: "Address", value: selectedUser.locationName || "N/A" },
              {
                label: "Status",
                value:
                  selectedUser.status === USER_STATUS.BLOCKED
                    ? "Blocked"
                    : "Active",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between border-b py-3">
                <span className="font-semibold">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Block User Modal */}
      <Modal
        open={blockModalVisible}
        onCancel={() => {
          setBlockModalVisible(false);
          setActionUser(null);
        }}
        onOk={confirmBlockUser}
        okText="Block"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: isBlocking }}
        centered
        width={300}
        closable={false}
      >
        {actionUser && (
          <div className="text-center">
            <p className="mb-2">Are you sure you want to block</p>
            <p className="font-semibold">{actionUser.firstName}?</p>
          </div>
        )}
      </Modal>

      {/* Unblock User Modal */}
      <Modal
        open={unblockModalVisible}
        onCancel={() => {
          setUnblockModalVisible(false);
          setActionUser(null);
        }}
        onOk={confirmUnblockUser}
        okText="Unblock"
        cancelText="Cancel"
        okButtonProps={{ loading: isUnblocking }}
        centered
        width={300}
        closable={false}
      >
        {actionUser && (
          <div className="text-center">
            <p className="mb-2">Are you sure you want to unblock</p>
            <p className="font-semibold">{actionUser.firstName}?</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default User;
