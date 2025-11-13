"use client";

import { useCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useGetSupportCustomersQuery,
  useSendImageMutation,
} from "@/redux/features/chat/chat.api";
import { useAppSelector } from "@/redux/hooks";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";
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

  // Local state for customers to update lastMessage
  const [customers, setCustomers] = useState<Customer[]>([]);

  const bearerToken = useAppSelector(useCurrentToken);
  const token = bearerToken?.split(" ")[1];

  const myId = "68f5bbb8a6bcef7eb7748085"; // Your admin/support ID

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sendImage, { isLoading }] = useSendImageMutation(); // it's take only multiple image. SendImage in a newFormData. field name will be "files"

  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const socketRef = useRef<Socket | null>(null);

  // Update local customers state when API data changes
  useEffect(() => {
    if (supportCustomers?.data) {
      setCustomers(supportCustomers.data);
    }
  }, [supportCustomers]);

  // Function to update customer's last message
  const updateCustomerLastMessage = (
    customerId: string,
    lastMessage: string
  ) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.receiver === customerId
          ? {
              ...customer,
              lastMessage,
              updatedAt: new Date().toISOString(),
            }
          : customer
      )
    );
  };

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
      toast.success("New message received");
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

      // Update customer's last message in the list
      updateCustomerLastMessage(data.senderId, data.content);
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
    }
  }, [customers, selectedCustomer]);

  const handleSendMessage = async () => {
    if (!selectedCustomer || !socketRef.current) return;

    // Image send করার logic - API দিয়ে
    if (image && imagePreview) {
      const formData = new FormData();
      formData.append("files", image);

      // Instantly show image in chat
      const imageMessage: Message = {
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
        content: "",
        attachments: [imagePreview], // Use preview URL temporarily
        createdAt: new Date().toISOString(),
      };

      // Add message to UI immediately
      setMessages((prev) => [...prev, imageMessage]);

      try {
        const response = await sendImage({
          id: selectedCustomer.receiver,
          data: formData,
        }).unwrap();

        // Update message with actual image URL from server if available
        if (response?.data?.attachments) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === imageMessage._id
                ? { ...msg, attachments: response.data.attachments }
                : msg
            )
          );
        }

        toast.success("Image sent successfully");
        setImage(null);
        setImagePreview(null);

        // Update customer's last message
        updateCustomerLastMessage(selectedCustomer.receiver, "📷 Photo");

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        // Remove the temporary message if send fails
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== imageMessage._id)
        );
        toast.error("Failed to send image");
        console.error("Image send error:", error);
      }
      return;
    }

    // Text message send করার logic - Socket দিয়ে
    if (!inputText.trim()) return;

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

    // Update the customer's last message in the list
    updateCustomerLastMessage(selectedCustomer.receiver, inputText);

    setInputText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("🚀 ~ handleFileUpload ~ file:", file);
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImage(file);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    console.log("🚀 ~ handleFileUpload ~ setImage:", file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

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
            imagePreview={imagePreview}
            handleRemoveImage={handleRemoveImage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerSupportChat;
