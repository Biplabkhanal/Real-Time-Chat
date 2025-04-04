import React, { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import UserStatus from "./UserStatus";
import SharedMediaModal from "./Messages/SharedMediaModal";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import ConversationDeleteModal from "./ChatHeader/ConversationDeleteModal";

const ChatHeader = ({
    selectedUser,
    onlineUsers,
    lastSeen,
    onConversationDeleted,
}) => {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { auth } = usePage().props;
    const dropdownRef = React.useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleDeleteConversation = async (userId) => {
        try {
            await axios.delete(`/conversation/${userId}`);
            toast.success("Conversation deleted successfully");
            if (typeof onConversationDeleted === "function") {
                onConversationDeleted();
            }
            setShowDeleteModal(false);
            setShowDropdown(false);
        } catch (error) {
            console.error("Error deleting conversation:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete conversation"
            );
        }
    };

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center">
                    <div
                        className="cursor-pointer"
                        onClick={() => setShowMediaModal(true)}
                    >
                        <UserAvatar
                            name={selectedUser.name}
                            isOnline={onlineUsers[selectedUser.id]}
                            avatar={selectedUser.avatar}
                        />
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="font-bold text-gray-900 dark:text-white">
                            {selectedUser.name}
                        </div>
                        <UserStatus
                            isOnline={onlineUsers[selectedUser.id]}
                            lastSeen={lastSeen}
                            userId={selectedUser.id}
                        />
                    </div>
                    <SharedMediaModal
                        isOpen={showMediaModal}
                        onClose={() => setShowMediaModal(false)}
                        currentUserId={auth.user.id}
                        otherUserId={selectedUser.id}
                    />
                </div>

                {/* Chat action buttons */}
                <div className="flex items-center space-x-3">
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Search in conversation"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>

                    {/* More options dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="More options"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                <div className="py-1">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        View profile
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        Block user
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Delete conversation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <ConversationDeleteModal
                    userId={selectedUser.id}
                    onConfirm={handleDeleteConversation}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default ChatHeader;
