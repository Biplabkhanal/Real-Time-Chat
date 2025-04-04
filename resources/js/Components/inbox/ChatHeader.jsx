import React, { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import UserStatus from "./UserStatus";
import SharedMediaModal from "./Messages/SharedMediaModal";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import axios from "axios";
import ConversationDeleteModal from "./ChatHeader/ConversationDeleteModal";
import MoreOptionsButton from "./ChatHeader/icons/MoreOptionsButton";
import SearchButton from "./ChatHeader/icons/SearchButton";
import BlockUserModal from "./ChatHeader/BlockUserModal";

const ChatHeader = ({
    selectedUser,
    onlineUsers,
    lastSeen,
    onConversationDeleted,
    showInfoSidebar,
    setShowInfoSidebar,
}) => {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [isUserBlocked, setIsUserBlocked] = useState(false);
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

    useEffect(() => {
        if (selectedUser?.id) {
            checkBlockStatus();
        }
    }, [selectedUser]);

    const checkBlockStatus = async () => {
        try {
            const response = await axios.get(
                `/block-status/${selectedUser.id}`
            );
            setIsUserBlocked(response.data.isBlocked);
        } catch (error) {
            console.error("Error checking block status:", error);
        }
    };

    const handleBlockUser = async () => {
        try {
            if (isUserBlocked) {
                await axios.delete(`/unblock-user/${selectedUser.id}`);
                setIsUserBlocked(false);
            } else {
                await axios.post("/block-user", {
                    blocked_user_id: selectedUser.id,
                });
                setIsUserBlocked(true);
            }
            setShowBlockModal(false);
        } catch (error) {
            console.error("Error blocking/unblocking user:", error);
            setShowBlockModal(false);
        }
    };

    const openBlockConfirmation = () => {
        setShowBlockModal(true);
    };

    const toggleInfoSidebar = () => {
        setShowInfoSidebar(!showInfoSidebar);
        if (showDropdown) {
            setShowDropdown(false);
        }
    };

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center">
                    <div>
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
                    <SearchButton />

                    {/* More options dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <MoreOptionsButton
                            onClick={() => setShowDropdown(!showDropdown)}
                            isActive={showDropdown}
                        />

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                <div className="py-1">
                                    <button
                                        onClick={toggleInfoSidebar}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {showInfoSidebar
                                            ? "Hide Conversation Info"
                                            : "View Conversation Info"}
                                    </button>
                                    <button
                                        onClick={() => openBlockConfirmation()}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {isUserBlocked
                                            ? "Unblock user"
                                            : "Block user"}
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

            {showBlockModal && (
                <BlockUserModal
                    onConfirm={handleBlockUser}
                    onCancel={() => setShowBlockModal(false)}
                    userId={selectedUser.id}
                    isBlocked={isUserBlocked}
                    userName={selectedUser.name}
                />
            )}
        </div>
    );
};

export default ChatHeader;
