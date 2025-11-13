"use client";

import { useGetACustomerChatQuery } from "@/redux/features/chat/chat.api";
import { PhoneFilled, RobotFilled, SendOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { BiImage, BiVideo } from "react-icons/bi";
import { HiPaperClip } from "react-icons/hi";
import { MdBorderVertical } from "react-icons/md";

interface SenderRecipient {
  _id: string;
  firstName?: string;
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

interface Customer {
  _id: string;
  email: string;
  profileImage: string;
  isOnline: boolean;
  receiver: string;
}

interface Props {
  selectedCustomer: Customer;
  realtimeMessages: Message[];
  inputText: string;
  setInputText: (val: string) => void;
  handleSendMessage: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  formatTime: (date: Date) => string;
  getInitials: (email: string) => string;
  isTyping: boolean;
  myId: string;
}

const ChatInbox = ({
  selectedCustomer,
  realtimeMessages,
  inputText,
  setInputText,
  handleSendMessage,
  handleFileUpload,
  handleKeyPress,
  fileInputRef,
  messagesEndRef,
  formatTime,
  getInitials,
  isTyping,
  myId,
}: Props) => {
  const { data: customerChat } = useGetACustomerChatQuery(selectedCustomer._id);

  // Get API messages
  const apiMessages: Message[] = customerChat?.data || [];

  // Combine API messages with realtime messages
  // Remove duplicates based on _id
  const allMessages = [...apiMessages, ...realtimeMessages].reduce(
    (acc: Message[], current: Message) => {
      const exists = acc.find((msg) => msg._id === current._id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    },
    []
  );

  // Sort by createdAt (oldest first)
  const sortedMessages = allMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {selectedCustomer.profileImage ? (
              <img
                src={selectedCustomer.profileImage}
                alt={selectedCustomer.email}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(selectedCustomer.email)}
              </div>
            )}
            {selectedCustomer.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {selectedCustomer.email.split("@")[0]}
            </h1>
            <p className="text-sm text-gray-600">
              {selectedCustomer.isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <PhoneFilled className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <BiVideo className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <MdBorderVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[calc(100vh-300px)]">
        {sortedMessages.map((msg) => {
          const isUser = msg.senderId?._id === myId;

          return (
            <div
              key={msg._id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end space-x-2 max-w-md ${
                  isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
                    isUser
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  {msg.senderId?.profileImage ? (
                    <img
                      src={msg.senderId.profileImage}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(msg.senderId?.email || "U")}
                    </div>
                  )}
                </div>

                <div>
                  {/* attachments */}
                  {msg.attachments?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {msg.attachments.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="attachment"
                          className="w-40 h-40 object-cover rounded-lg shadow-sm"
                        />
                      ))}
                    </div>
                  )}

                  {/* text */}
                  {msg.content && (
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  )}

                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(new Date(msg.createdAt))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2 max-w-md">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <RobotFilled className="w-5 h-5 text-gray-700" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <BiImage className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <HiPaperClip className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
          <button
            onClick={handleSendMessage}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg"
          >
            <SendOutlined className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInbox;
