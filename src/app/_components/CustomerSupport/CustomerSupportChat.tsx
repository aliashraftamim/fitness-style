"use client";

import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetSupportCustomersQuery } from "@/redux/features/chat/chat.api";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatInbox from "./ChatInbox";
import CustomerList from "./CustomerList";

interface Customer {
  _id: string;
  email: string;
  partnerName: string;
  profileImage: string;
  isOnline: boolean;
  receiver: string;
  sender: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface SenderRecipient {
  _id: string;
  partnerName?: string;
  email: string;
  profileImage: string;
  isOnline: boolean;
}

interface Message {
  _id: string;
  senderId: SenderRecipient;
  recipientId: SenderRecipient;
  content: string;
  attachments: string[];
  createdAt: string;
}

const CustomerSupportChat = () => {
  const { data: supportCustomers } = useGetSupportCustomersQuery(undefined);
  console.log("🚀 ~ CustomerSupportChat ~ supportCustomers:", supportCustomers);
  const customers = supportCustomers?.data || [];
  const bearerToken = useAppSelector(useCurrentToken);
  const token = bearerToken?.split(" ")[1];

  const myId = "68f5bbb8a6bcef7eb7748085"; // Your admin/support ID

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  console.log("🚀 ~ CustomerSupportChat ~ selectedCustomer:", selectedCustomer);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const socketRef = useRef<Socket | null>(null);

  // --- Socket Connect Once ---
  useEffect(() => {
    if (!token) {
      return;
    }

    socketRef.current = io("http://10.10.10.4:2000/chat", {
      extraHeaders: { token },
    });

    const socket = socketRef.current;

    console.log("🟢 Connecting socket...", socket);

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
    socket.on("connect_error", (err) =>
      console.log("⚠️ Socket connection error:", err)
    );

    socket.on("new_message", (data: any) => {
      const isFromSelectedCustomer =
        data.senderId === selectedCustomer?.receiver;
      const isToSelectedCustomer =
        data.recipientId === selectedCustomer?.receiver;

      if (!isFromSelectedCustomer && !isToSelectedCustomer) {
        console.log("❌ Message not for current chat, ignoring");
        return;
      }

      // Create message in the same format as API messages
      const newMsg: Message = {
        _id: Date.now().toString(),
        senderId: {
          _id: data.senderId || selectedCustomer?.receiver || "",
          email: selectedCustomer?.email || "",
          profileImage: selectedCustomer?.profileImage || "",
          isOnline: selectedCustomer?.isOnline || false,
        },
        recipientId: {
          _id: myId,
          email: "",
          profileImage: "",
          isOnline: true,
        },
        content: data.content,
        attachments: data.attachments || [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, selectedCustomer]);

  // --- Join Room when selectedCustomer changes ---
  useEffect(() => {
    if (!selectedCustomer || !socketRef.current) return;
    const socket = socketRef.current;

    socket.emit("join_room", selectedCustomer.receiver);
    console.log("➡️ Joining room:", selectedCustomer.receiver);

    // Reset messages on new customer select
    setMessages([]);
  }, [selectedCustomer]);

  useEffect(() => {
    if (customers.length && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
      console.log("🚀 ~ CustomerSupportChat ~ customers[0]:", customers[0]);
    }
  }, [customers, selectedCustomer]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedCustomer || !socketRef.current) return;

    // Create message in the same format as API messages
    const message: Message = {
      _id: Date.now().toString(),
      senderId: {
        _id: myId,
        email: "",
        profileImage: "",
        isOnline: true,
      },
      recipientId: {
        _id: selectedCustomer.receiver,
        email: selectedCustomer.email,
        profileImage: selectedCustomer.profileImage,
        isOnline: selectedCustomer.isOnline,
      },
      content: inputText,
      attachments: [],
      createdAt: new Date().toISOString(),
    };

    console.log(
      "🚀 ~ handleSendMessage ~ selectedCustomer.receiver:",
      selectedCustomer.receiver
    );
    socketRef.current.emit("send_message", {
      recipientId: selectedCustomer.receiver,
      content: inputText,
      messageType: "PRIVATE",
    });

    setMessages((prev) => [...prev, message]);
    setInputText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const getInitials = (email: string) => {
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };
  const getUserName = (email: string) =>
    selectedCustomer?.partnerName || email.split("@")[0];
  const getTimeAgo = (date: string) => "Just now";

  if (!supportCustomers)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-100 overflow-hidden">
      <CustomerList
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getInitials={getInitials || ""}
        getUserName={getUserName}
        getTimeAgo={getTimeAgo}
      />

      {selectedCustomer && (
        <div className="flex-1 flex flex-col">
          <ChatInbox
            selectedCustomer={selectedCustomer}
            realtimeMessages={messages}
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            handleKeyPress={handleKeyPress}
            fileInputRef={fileInputRef}
            messagesEndRef={messagesEndRef}
            formatTime={formatTime}
            getInitials={getInitials}
            isTyping={isTyping}
            myId={myId}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerSupportChat;
