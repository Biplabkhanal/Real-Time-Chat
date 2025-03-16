import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Inbox({ auth, users }) {
    const webSocketChannel = `message.${auth.user.id}`;

    const [selectedUser, setSelectedUser] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [attachments, setAttachments] = useState([]);

    const targetScrollRef = useRef(null);
    const selectedUserRef = useRef(null);
    const inputRef = useRef(null);

    // Filter users based on search input
    useEffect(() => {
        if (searchInput.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) =>
                user.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchInput, users]);

    const scrollToBottom = () => {
        if (targetScrollRef.current) {
            targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const sendMessage = async () => {
        if (messageInput.trim() === "" && attachments.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            await axios.post(`/message/${selectedUserRef.current.id}`, {
                message: messageInput,
                attachments: attachments,
            });
            setMessageInput("");
            setAttachments([]); // Clear all attachments
            await getMessages();
            if (inputRef.current) inputRef.current.focus();
        } catch (err) {
            setError("Failed to send message. Please try again.");
            console.error("Error sending message:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const getMessages = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `/message/${selectedUserRef.current.id}`
            );
            setCurrentMessages(response.data);
        } catch (err) {
            setError("Failed to load messages. Please refresh the page.");
            console.error("Error fetching messages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMessage = async (messageId) => {
        if (!confirm("Are you sure you want to delete this message?")) {
            return;
        }

        try {
            await axios.delete(`/message/${messageId}`);
            // Update messages list after deletion
            getMessages();
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error(
                error.response?.data?.error || "Failed to delete message"
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (selectedUser) {
            getMessages();
            if (inputRef.current) inputRef.current.focus();
        }
    }, [selectedUser]);

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, [currentMessages]);

    const connectWebSocket = () => {
        window.Echo.private(webSocketChannel)
            .listen("MessageSent", async (e) => {
                await getMessages();
            })
            .listen("MessageDeleted", (e) => {
                // Update messages when a message is deleted
                getMessages();
            });
    };

    useEffect(() => {
        connectWebSocket();
        return () => {
            window.Echo.leave(webSocketChannel);
        };
    }, []);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (selectedUser) {
            setMessageInput("");
            setAttachments([]);

            getMessages();
            if (inputRef.current) inputRef.current.focus();
        }
    }, [selectedUser]);

    const toggleDropdown = (event) => {
        const dropdown = event.currentTarget.nextElementSibling;
        dropdown.classList.toggle("hidden");

        const closeDropdown = (e) => {
            if (
                !dropdown.contains(e.target) &&
                e.target !== event.currentTarget
            ) {
                dropdown.classList.add("hidden");
                document.removeEventListener("click", closeDropdown);
            }
        };
        setTimeout(() => {
            document.addEventListener("click", closeDropdown);
        }, 10);
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return "";

        const messageDate = new Date(timestamp);
        const now = new Date();

        // Calculate time difference in milliseconds
        const diffMs = now - messageDate;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        // Format based on how long ago
        if (diffMins < 1) {
            return "Just now";
        } else if (diffMins === 1) {
            return "1 minute ago";
        } else if (diffMins < 60) {
            return `${diffMins} minutes ago`;
        } else if (diffHours === 1) {
            return "1 hour ago";
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            // For older messages, show the actual date
            return messageDate.toLocaleDateString();
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="ChatSync - Inbox" />

            <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 font-bold text-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h2 className="text-gray-800 dark:text-white">Chats</h2>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {filteredUsers.length}
                        </span>
                    </div>

                    {/* Search bar */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg
                                           bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <svg
                                className="absolute left-2 top-[0.85rem] h-4 w-4 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {filteredUsers.length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No contacts found
                            </div>
                        )}
                        <div className="space-y-2">
                            {filteredUsers.map((user, key) => (
                                <div
                                    key={key}
                                    onClick={() => setSelectedUser(user)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                                               ${
                                                   user.id === selectedUser?.id
                                                       ? "bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500"
                                                       : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                               }`}
                                >
                                    {/* User avatar with first letter of name */}
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-900">
                    {!selectedUser ? (
                        <div className="h-full flex justify-center items-center flex-col space-y-4 p-6">
                            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Start a conversation
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
                                Select a contact from the list to start chatting
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        {selectedUser.name}
                                    </div>
                                    {/* <div className="text-xs text-green-500">
                                        Online
                                    </div> */}
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                                {isLoading && currentMessages.length === 0 && (
                                    <div className="flex justify-center p-6">
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="flex-1 space-y-4 py-1">
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                                        <p>{error}</p>
                                        <button
                                            onClick={getMessages}
                                            className="text-sm underline mt-1"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                )}

                                {currentMessages.length === 0 &&
                                    !isLoading &&
                                    !error && (
                                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            <p>
                                                No messages yet. Start a
                                                conversation!
                                            </p>
                                        </div>
                                    )}

                                {currentMessages.map((message, index) => {
                                    const isCurrentUser =
                                        message.sender_id === auth.user.id;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                isCurrentUser
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`relative max-w-md ${
                                                    isCurrentUser
                                                        ? "bg-blue-500 text-white rounded-l-lg rounded-br-lg"
                                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-r-lg rounded-bl-lg border border-gray-200 dark:border-gray-700"
                                                } p-4 shadow`}
                                            >
                                                {isCurrentUser && (
                                                    <div className="absolute top-1 right-1">
                                                        <div className="dropdown inline-block relative">
                                                            <button
                                                                className="p-1 text-blue-200 hover:text-white transition-colors"
                                                                title="Message options"
                                                                onClick={
                                                                    toggleDropdown
                                                                }
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <div className="dropdown-menu hidden absolute right-0 bg-white dark:bg-gray-800 rounded shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                                                <button
                                                                    onClick={() =>
                                                                        deleteMessage(
                                                                            message.id
                                                                        )
                                                                    }
                                                                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4 mr-2"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="break-words">
                                                    {message.message}
                                                </p>

                                                {/* Display attachment if exists */}
                                                {message.attachment && (
                                                    <div className="mt-2 pt-2 border-gray-200 dark:border-gray-700">
                                                        {message.attachment
                                                            .type &&
                                                        message.attachment.type.startsWith(
                                                            "image/"
                                                        ) ? (
                                                            // Display image inline
                                                            <a
                                                                href={
                                                                    message
                                                                        .attachment
                                                                        .url
                                                                }
                                                                target="_blank"
                                                                className="block mt-1"
                                                            >
                                                                <img
                                                                    src={
                                                                        message
                                                                            .attachment
                                                                            .url
                                                                    }
                                                                    alt={
                                                                        message
                                                                            .attachment
                                                                            .name
                                                                    }
                                                                    className="max-h-40 max-w-full rounded"
                                                                />
                                                            </a>
                                                        ) : (
                                                            // Display file link for non-images
                                                            <a
                                                                href={
                                                                    message
                                                                        .attachment
                                                                        .url
                                                                }
                                                                target="_blank"
                                                                className="flex items-center text-sm hover:underline text-blue-300"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4 mr-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                                    />
                                                                </svg>
                                                                {
                                                                    message
                                                                        .attachment
                                                                        .name
                                                                }
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                <span className="block text-xs mt-1 opacity-70">
                                                    {formatMessageTime(
                                                        message.created_at
                                                    )}
                                                    {isCurrentUser && (
                                                        <span className="ml-1">
                                                            ✓✓
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <span ref={targetScrollRef}></span>
                            </div>

                            {/* Message Input */}
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                {error && error.includes("send") && (
                                    <div className="mb-2 text-sm text-red-500 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* Attachments preview */}
                                {attachments.length > 0 && (
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2 mr-[3.6rem]">
                                        <div className="flex flex-wrap gap-2">
                                            {attachments.map(
                                                (attachment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center bg-white dark:bg-gray-800 p-2 rounded"
                                                    >
                                                        <div className="flex-grow overflow-hidden flex items-center">
                                                            {attachment.type &&
                                                            attachment.type.startsWith(
                                                                "image/"
                                                            ) ? (
                                                                // Show image preview if it's an image file
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={
                                                                            attachment.url
                                                                        }
                                                                        alt={
                                                                            attachment.name
                                                                        }
                                                                        className="h-10 w-10 object-cover rounded mr-2"
                                                                    />
                                                                    <span className="text-sm truncate max-w-[140px] text-white">
                                                                        {
                                                                            attachment.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                // Show file icon for non-image files
                                                                <div className="flex items-center">
                                                                    <svg
                                                                        className="w-5 h-5 mr-2 text-blue-500"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                        />
                                                                    </svg>
                                                                    <span className="text-sm truncate max-w-[140px]">
                                                                        {
                                                                            attachment.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            className="ml-2 text-gray-500"
                                                            onClick={() => {
                                                                const newAttachments =
                                                                    [
                                                                        ...attachments,
                                                                    ];
                                                                newAttachments.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                setAttachments(
                                                                    newAttachments
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <div className="flex-1 relative">
                                        <textarea
                                            ref={inputRef}
                                            rows="1"
                                            placeholder="Type a message..."
                                            className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg resize-none
                                                    bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={messageInput}
                                            onChange={(e) =>
                                                setMessageInput(e.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                        ></textarea>
                                        <div className="absolute right-3 bottom-3 flex space-x-1">
                                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>
                                            <>
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    className="hidden"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files =
                                                            e.target.files;
                                                        if (files.length > 0) {
                                                            // Convert FileList to Array
                                                            const fileArray =
                                                                Array.from(
                                                                    files
                                                                );

                                                            // Show loading toast
                                                            const loadingToast =
                                                                toast.loading(
                                                                    `Uploading ${fileArray.length} file(s)...`
                                                                );

                                                            // Create an array to track upload promises
                                                            const uploadPromises =
                                                                [];

                                                            // Process each file
                                                            fileArray.forEach(
                                                                (file) => {
                                                                    const formData =
                                                                        new FormData();
                                                                    formData.append(
                                                                        "file",
                                                                        file
                                                                    );

                                                                    const uploadPromise =
                                                                        axios
                                                                            .post(
                                                                                "/upload-file",
                                                                                formData,
                                                                                {
                                                                                    headers:
                                                                                        {
                                                                                            "Content-Type":
                                                                                                "multipart/form-data",
                                                                                        },
                                                                                }
                                                                            )
                                                                            .then(
                                                                                (
                                                                                    response
                                                                                ) => {
                                                                                    // Return the file info
                                                                                    return {
                                                                                        url: response
                                                                                            .data
                                                                                            .url,
                                                                                        name: file.name,
                                                                                        type: file.type,
                                                                                        path: response
                                                                                            .data
                                                                                            .path,
                                                                                    };
                                                                                }
                                                                            );

                                                                    uploadPromises.push(
                                                                        uploadPromise
                                                                    );
                                                                }
                                                            );

                                                            // Wait for all uploads to complete
                                                            Promise.all(
                                                                uploadPromises
                                                            )
                                                                .then(
                                                                    (
                                                                        newAttachments
                                                                    ) => {
                                                                        // Add the new attachments to existing ones
                                                                        setAttachments(
                                                                            (
                                                                                prevAttachments
                                                                            ) => [
                                                                                ...prevAttachments,
                                                                                ...newAttachments,
                                                                            ]
                                                                        );

                                                                        // Dismiss loading toast and show success
                                                                        toast.dismiss(
                                                                            loadingToast
                                                                        );
                                                                        toast.success(
                                                                            `${fileArray.length} file(s) attached`
                                                                        );

                                                                        // Clear the input
                                                                        e.target.value =
                                                                            "";
                                                                    }
                                                                )
                                                                .catch(
                                                                    (error) => {
                                                                        console.error(
                                                                            "Error uploading files:",
                                                                            error
                                                                        );
                                                                        toast.dismiss(
                                                                            loadingToast
                                                                        );
                                                                        toast.error(
                                                                            "Failed to upload files"
                                                                        );
                                                                    }
                                                                );
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                "fileInput"
                                                            )
                                                            .click()
                                                    }
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        </div>
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={
                                            isLoading ||
                                            (messageInput.trim() === "" &&
                                                attachments.length === 0)
                                        }
                                        className={`ml-4 p-3 rounded-full ${
                                            isLoading ||
                                            (messageInput.trim() === "" &&
                                                attachments.length === 0)
                                                ? "bg-blue-300 dark:bg-blue-800 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600"
                                        } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                        {isLoading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                    Press Enter to send, Shift+Enter for new
                                    line
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
