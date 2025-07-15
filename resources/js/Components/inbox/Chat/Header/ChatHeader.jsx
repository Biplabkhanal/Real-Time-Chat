import React, { useEffect, useState } from "react";
import UserAvatar from "../../UserList/UserAvatar";
import UserStatus from "../../UserList/UserStatus";
import SharedMediaModal from "../../Modals/SharedMediaModal";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import axios from "axios";
import ConversationDeleteModal from "../../Modals/ConversationDeleteModal";
import MoreOptionsButton from "../../Shared/Icons/MoreOptionsButton";
import SearchButton from "../../Shared/Icons/SearchButton";
import BlockUserModal from "../../Modals/BlockUserModal";
import NicknameEditor from "./NicknameEditor";

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
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [isUserBlocked, setIsUserBlocked] = useState(false);
    const [isBlockedByUser, setIsBlockedByUser] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { auth } = usePage().props;
    const dropdownRef = React.useRef();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

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
            const { isBlocked, isBlockedByUser } = response.data;
            setIsUserBlocked(isBlocked);
            setIsBlockedByUser(isBlockedByUser);
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

    const handleNicknameUpdate = (newDisplayName, closeModal = true) => {
        selectedUser.display_name = newDisplayName;

        if (closeModal) {
            setShowNicknameModal(false);
            setShowDropdown(false);
        }
    };

    const openBlockConfirmation = () => {
        setShowBlockModal(true);
    };

    const toggleInfoSidebar = () => {
        if (isMobile) {
            return;
        }

        setShowInfoSidebar(!showInfoSidebar);
        if (showDropdown) {
            setShowDropdown(false);
        }
    };

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-3 ">
                <div className="flex items-center flex-1">
                    <div>
                        <UserAvatar
                            name={
                                selectedUser.display_name || selectedUser.name
                            }
                            isOnline={onlineUsers[selectedUser.id]}
                            avatar={selectedUser.avatar}
                        />
                    </div>
                    <div className="ml-4 flex-1">
                        {isMobile ? (
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white mb-1">
                                    {selectedUser.display_name ||
                                        selectedUser.name}
                                </div>
                                <UserStatus
                                    isOnline={onlineUsers[selectedUser.id]}
                                    lastSeen={lastSeen}
                                    userId={selectedUser.id}
                                    isMobile={true}
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                    {selectedUser.display_name ||
                                        selectedUser.name}
                                </div>
                                <UserStatus
                                    isOnline={onlineUsers[selectedUser.id]}
                                    lastSeen={lastSeen}
                                    userId={selectedUser.id}
                                    isMobile={false}
                                />
                            </div>
                        )}
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
                    {!isMobile && <SearchButton />}

                    <div className="relative" ref={dropdownRef}>
                        <MoreOptionsButton
                            onClick={() => setShowDropdown(!showDropdown)}
                            isActive={showDropdown}
                        />

                        {showDropdown && (
                            <div className="absolute right-0 mt-5 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                <div className="py-1">
                                    {!isMobile && (
                                        <button
                                            onClick={toggleInfoSidebar}
                                            disabled={isBlockedByUser}
                                            className={`block w-full text-left px-4 py-2 text-sm ${
                                                isBlockedByUser
                                                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {showInfoSidebar
                                                ? "Hide Conversation Info"
                                                : "View Conversation Info"}
                                            {isBlockedByUser && (
                                                <span className="block text-xs italic text-gray-400 dark:text-gray-500">
                                                    * Not available - you've
                                                    been blocked
                                                </span>
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setShowNicknameModal(true);
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Set Nickname
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

            {showNicknameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden mx-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Set Nickname
                            </h3>
                            <button
                                onClick={() => setShowNicknameModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <NicknameEditor
                                selectedUser={selectedUser}
                                onNicknameSaved={handleNicknameUpdate}
                            />
                        </div>
                        <div
                            className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
                                isMobile ? "flex justify-center" : "text-right"
                            }`}
                        >
                            <button
                                onClick={() => setShowNicknameModal(false)}
                                className={`${
                                    isMobile ? "w-full" : ""
                                } px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200
                                dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatHeader;
