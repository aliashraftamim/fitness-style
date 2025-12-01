"use client";

import { useGetACustomerChatQuery } from "@/redux/features/chat/chat.api";
import { PhoneFilled, RobotFilled } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiImage, BiVideo } from "react-icons/bi";
import { BsSendArrowUp } from "react-icons/bs";
import { HiPaperClip } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdBorderVertical, MdClose } from "react-icons/md";

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
  imagePreview: string | null;
  handleRemoveImage: () => void;
  isLoading: boolean;
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
  imagePreview,
  handleRemoveImage,
  isLoading,
}: Props) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [allLoadedMessages, setAllLoadedMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: customerChat, isFetching } = useGetACustomerChatQuery({
    id: selectedCustomer._id,
    query: { limit: 20, page },
  });

  // Image viewer state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll management refs
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);
  const isInitialLoadRef = useRef(true);
  const prevCustomerIdRef = useRef(selectedCustomer._id);
  const prevMessageLengthRef = useRef(0);

  // Load messages from API
  useEffect(() => {
    if (customerChat?.data) {
      const newMessages = customerChat.data;

      if (newMessages.length < 20) {
        setHasMore(false);
      }

      setAllLoadedMessages((prev) => {
        const messageMap = new Map(prev.map((msg) => [msg._id, msg]));
        newMessages.forEach((msg: Message) => messageMap.set(msg._id, msg));
        return Array.from(messageMap.values());
      });

      setIsLoadingMore(false);
    }
  }, [customerChat]);

  // Reset when customer changes
  useEffect(() => {
    if (prevCustomerIdRef.current !== selectedCustomer._id) {
      setPage(1);
      setAllLoadedMessages([]);
      setHasMore(true);
      isInitialLoadRef.current = true;
      prevScrollHeight.current = 0;
      setIsAtBottom(true);
      prevCustomerIdRef.current = selectedCustomer._id;
      prevMessageLengthRef.current = 0;
    }
  }, [selectedCustomer._id]);

  // Memoize sorted messages to prevent unnecessary recalculations
  const sortedMessages = useMemo(() => {
    const messageMap = new Map<string, Message>();

    // Add loaded messages
    allLoadedMessages.forEach((msg) => messageMap.set(msg._id, msg));

    // Add realtime messages (will override if duplicate)
    realtimeMessages.forEach((msg) => messageMap.set(msg._id, msg));

    // Convert to array and sort
    return Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [allLoadedMessages, realtimeMessages]);

  // Extract all images - memoized
  const allImages = useMemo(() => {
    const images: string[] = [];
    sortedMessages.forEach((msg) => {
      if (msg.attachments?.length > 0) {
        images.push(...msg.attachments);
      }
    });
    return images;
  }, [sortedMessages]);

  // Check if at bottom
  const checkIfAtBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 100;
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;
    setIsAtBottom(isBottom);
  }, []);

  // Handle scroll with pagination
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    checkIfAtBottom();

    // Load more on scroll to top
    if (container.scrollTop < 100 && hasMore && !isLoadingMore && !isFetching) {
      setIsLoadingMore(true);
      prevScrollHeight.current = container.scrollHeight;
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isLoadingMore, isFetching, checkIfAtBottom]);

  // Maintain scroll position after loading more
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || isInitialLoadRef.current) return;

    if (prevScrollHeight.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;
      container.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
    }
  }, [allLoadedMessages]);

  // Auto scroll logic - FIXED to prevent infinite loop
  useEffect(() => {
    const currentLength = sortedMessages.length;
    const hasNewMessage = currentLength > prevMessageLengthRef.current;

    if (isInitialLoadRef.current && currentLength > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        isInitialLoadRef.current = false;
        prevMessageLengthRef.current = currentLength;
      }, 100);
    } else if (hasNewMessage && isAtBottom && !isInitialLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessageLengthRef.current = currentLength;
    }
  }, [sortedMessages.length, isAtBottom]);

  // Image viewer handlers
  const handleImageClick = useCallback(
    (imageUrl: string) => {
      const index = allImages.indexOf(imageUrl);
      setCurrentImageIndex(index);
      setSelectedImage(imageUrl);
    },
    [allImages]
  );

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(allImages[currentImageIndex - 1]);
    }
  }, [currentImageIndex, allImages]);

  const handleNextImage = useCallback(() => {
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(allImages[currentImageIndex + 1]);
    }
  }, [currentImageIndex, allImages]);

  const closeImageViewer = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Keyboard navigation for image viewer
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImageViewer();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePrevImage, handleNextImage, closeImageViewer]);

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
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 px-6 py-4 space-y-4 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[calc(100vh-300px)]"
      >
        {/* Loading indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading messages...</span>
            </div>
          </div>
        )}

        {/* No more messages */}
        {!hasMore && sortedMessages.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-4 py-2 rounded-full">
              No more messages
            </div>
          </div>
        )}

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
                          className="w-40 h-40 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(img)}
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

      {/* Scroll to Bottom Button */}
      {!isAtBottom && (
        <button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setIsAtBottom(true);
          }}
          className="absolute bottom-24 right-8 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg !text-white z-10"
        >
          ↓
        </button>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 relative">
        {imagePreview && (
          <div className="absolute bottom-16 inline-block mr-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg border-2 border-blue-500"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

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
            <BsSendArrowUp className="w-5 h-5 !text-white" />
          </button>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeImageViewer}
        >
          <div
            className="relative max-w-7xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <MdClose className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Previous Button */}
            {currentImageIndex > 0 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all"
              >
                <IoChevronBack className="w-7 h-7" />
              </button>
            )}

            {/* Next Button */}
            {currentImageIndex < allImages.length - 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all"
              >
                <IoChevronForward className="w-7 h-7" />
              </button>
            )}

            {/* Image */}
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInbox;
