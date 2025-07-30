import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserAvatar from "../UserList/UserAvatar";
import { filterBlockedUsers } from "@/utils/filterBlockedUsers";

const ForwardMessageModal = ({ message, onClose, onForward }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [additionalMessage, setAdditionalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchFriendsAndBlocked = async () => {
            try {
                setIsFetching(true);
                const [friendsRes, blockedRes, blockedByRes] =
                    await Promise.all([
                        axios.get("/friends"),
                        axios.get("/blocked-users"),
                        axios.get("/blocked-by-users"),
                    ]);
                const filteredFriends = filterBlockedUsers(
                    friendsRes.data,
                    blockedRes.data,
                    blockedByRes.data
                );
                setFriends(filteredFriends);
            } catch (error) {
                toast.error("Failed to load friends or blocked users");
                console.error(
                    "Error fetching friends or blocked users:",
                    error
                );
            } finally {
                setIsFetching(false);
            }
        };

        fetchFriendsAndBlocked();
    }, []);

    const handleSelectAll = () => {
        if (selectedFriends.length === friends.length) {
            setSelectedFriends([]);
        } else {
            setSelectedFriends([...friends]);
        }
    };

    const handleFriendToggle = (friend) => {
        setSelectedFriends((prev) => {
            const isSelected = prev.find((f) => f.id === friend.id);
            if (isSelected) {
                return prev.filter((f) => f.id !== friend.id);
            } else {
                return [...prev, friend];
            }
        });
    };

    const handleForward = async () => {
        if (selectedFriends.length === 0) {
            toast.error("Please select at least one friend to forward to");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `/message/${message.id}/forward`,
                {
                    recipient_ids: selectedFriends.map((friend) => friend.id),
                    message: additionalMessage || message.message,
                }
            );
            onForward(response.data);
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to forward message"
            );
            console.error("Error forwarding message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto sm:mx-4 overflow-y-auto max-h-[90vh] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Forward Message to Friends
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg
                            className="w-6 h-6"
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

                {/* Original Message Preview */}
                <div className="mb-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="bg-gray-50 dark:bg-blue-900 p-2 rounded text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {message.message}
                        {message.attachment && (
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                                📎 {message.attachment.name || "Attachment"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Friends List */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            Send to:
                        </label>
                        {friends.length > 0 && (
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {selectedFriends.length === friends.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        )}
                    </div>
                    {isFetching ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                            {friends.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No friends available
                                </p>
                            ) : (
                                friends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        className={`p-2 sm:p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition-colors ${
                                            selectedFriends.find(
                                                (f) => f.id === friend.id
                                            )
                                                ? "bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleFriendToggle(friend)
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedFriends.find(
                                                    (f) => f.id === friend.id
                                                ) !== undefined
                                            }
                                            onChange={() =>
                                                handleFriendToggle(friend)
                                            }
                                            className="mr-2 sm:mr-3"
                                        />
                                        <div className="flex items-center">
                                            <div className="mr-2 sm:mr-3">
                                                <UserAvatar
                                                    name={friend.name}
                                                    avatar={friend.avatar}
                                                    size="w-7 h-7 sm:w-8 sm:h-8"
                                                    textSize="text-xs sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {friend.name}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                                    {friend.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Additional Message */}
                <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add a message (optional):
                    </label>
                    <textarea
                        value={additionalMessage}
                        onChange={(e) => setAdditionalMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows="3"
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-xs sm:text-sm text-gray-500 dark:text-gray-300"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={
                            isLoading ||
                            selectedFriends.length === 0 ||
                            isFetching
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs sm:text-base"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Forwarding...
                            </>
                        ) : (
                            <>
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
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                                Forward
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForwardMessageModal;
