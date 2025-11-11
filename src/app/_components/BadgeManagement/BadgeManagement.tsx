"use client";

import {
  useBlockBadgeMutation,
  useGetBadgesQuery,
  useUnblockBadgeMutation,
} from "@/redux/features/admin/badge.api";
import { EyeOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Avatar, Button, Form, Space, Table, Tooltip } from "antd";
import React, { useState } from "react";
import { GoBlocked } from "react-icons/go";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import AddBadgeModal from "./AddBadgeModal";

interface DataType {
  key: React.Key;
  serial: string;
  name: string;
  tiers: string;
  tiersId: string;
  numberOfContent: number;
  createdAt: string;
  status: string;
  avatar: string;
  action: React.ReactNode;
}

const BadgeManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Query badges from API with search + date filter
  const { data: response, isLoading } = useGetBadgesQuery({
    page,
    limit,
    searchTerm,
    createdAt: selectedDate,
  });

  const [blockBadge] = useBlockBadgeMutation();
  const [unblockBadge] = useUnblockBadgeMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<DataType | null>(null);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockBadgeData, setBlockBadgeData] = useState<DataType | null>(null);
  const [addBadgeModalVisible, setAddBadgeModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleViewBadge = (badge: DataType) => {
    setSelectedBadge(badge);
    setIsModalVisible(true);
  };

  const handleBlockBadge = async (badge: DataType) => {
    try {
      await blockBadge(badge.key).unwrap();
      toast.success("Badge blocked successfully!");
      // refetch or update table
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblockBadge = async (badge: DataType) => {
    try {
      await unblockBadge(badge.key).unwrap();
      toast.success("Badge unblocked successfully!");
      // refetch or update table
    } catch (err) {
      console.error(err);
    }
  };

  const badges = response?.data || [];

  const dataSource: DataType[] = badges.map((badge: any, index: number) => ({
    key: badge._id,
    serial: `#${((page - 1) * limit + index + 1).toString().padStart(2, "0")}`,
    name: badge.name,
    tiers: badge.tiersId || "N/A",
    tiersId: badge.tiersId,
    numberOfContent: badge.numberOfContent || 0,
    createdAt: badge.createdAt,
    status: badge.status === "ACTIVE" ? "Active" : "Inactive",
    avatar: badge.badgeIcon || "/default-avatar.png",
    action: null,
  }));

  const tiersFilters = Array.from(new Set(dataSource.map((i) => i.tiers))).map(
    (tier) => ({
      text: tier,
      value: tier,
    })
  );

  const statusFilters = [
    { text: "Active", value: "Active" },
    { text: "Inactive", value: "Inactive" },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Serial",
      dataIndex: "serial",
      width: "10%",
      align: "center",
      render: (text) => <span className="pl-4">{text}</span>,
    },
    {
      title: "Badges Name",
      dataIndex: "name",
      width: "20%",
      align: "start",
      render: (text, record) => (
        <Space className="justify-start flex w-full">
          <Avatar src={record.avatar} size={32} />
          {text}
        </Space>
      ),
    },
    {
      title: "Tiers",
      dataIndex: "tiers",
      width: "15%",
      align: "start",
      filters: tiersFilters,
      onFilter: (value, record) => record.tiers === value,
      filterSearch: true,
      filterMultiple: false,
    },
    {
      title: "Content Count",
      dataIndex: "numberOfContent",
      width: "15%",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      align: "center",
      filters: statusFilters,
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === "Active"
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-100"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Created Date",
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
              onClick={() => handleViewBadge(record)}
              className="text-lg cursor-pointer"
            />
          </Tooltip>
          {record.status === "Active" ? (
            <Tooltip title="Block Badge">
              <GoBlocked
                color="red"
                className="text-lg cursor-pointer"
                onClick={() => handleBlockBadge(record)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unblock Badge">
              <GoBlocked
                color="green"
                className="text-lg cursor-pointer"
                onClick={() => handleUnblockBadge(record)}
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
          className="bg-gray-100 text-gray-700 text-center font-semibold py-3"
        >
          {props.children}
        </th>
      ),
    },
  };

  return (
    <div className="py-5 pt-10 max-w-[1200px] mx-auto">
      {/* Add Button */}
      <div className="mb-4">
        <Button
          className="w-full !py-5 !text-brand-primary !border !border-brand-primary !text-lg flex items-center justify-center gap-2"
          size="large"
          icon={<IoMdAddCircleOutline size={22} />}
          onClick={() => setAddBadgeModalVisible(true)}
        >
          Add New Badge
        </Button>
      </div>
      {/* Search & Date Filter */}
      <div className="flex items-center justify-between my-4 gap-4">
        <input
          type="text"
          placeholder="Search Badge..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-3 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-3 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {/* Table */}
      <div className="py-[10px] rounded-[20px] bg-[#F5F5F5] overflow-hidden">
        <Table<DataType>
          columns={columns}
          dataSource={dataSource}
          components={components}
          pagination={{
            current: page,
            pageSize: limit,
            total: response?.meta || 0,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
          }}
          loading={isLoading}
          style={{ borderRadius: "20px", overflow: "hidden" }}
        />
      </div>
      <AddBadgeModal
        isOpen={addBadgeModalVisible}
        onClose={() => setAddBadgeModalVisible(false)}
      />
    </div>
  );
};

export default BadgeManagement;
