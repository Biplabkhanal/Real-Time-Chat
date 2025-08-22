import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserAvatar from "../../Components/FriendRequests/UserAvatar";
import { filterBlockedUsers } from "@/utils/filterBlockedUsers";
import { LoadingIcon } from "../../Components/FriendRequests/icons";
import { useSharePost } from "./useSharePost";

const SharePostModal = ({ post, onClose, onShare }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

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

    const handleFriendToggle = (friend) => {
        setSelectedFriends((prevSelected) => {
            if (prevSelected.find((f) => f.id === friend.id)) {
                return prevSelected.filter((f) => f.id !== friend.id);
            } else {
                return [...prevSelected, friend];
            }
        });
    };

    const handleFriendClick = async (friend) => {
        setIsLoading(true);
        try {
            await axios.post(`/share-post/${post.id}/to/${friend.id}`);
            toast.success(`Post shared with ${friend.name}`);
            if (onShare) onShare(friend);
            onClose();
        } catch (error) {
            toast.error("Failed to share post");
            console.error("Error sharing post:", error);
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white text-center">
                    Share Post with a Friend
                </h2>
                <hr className="mb-4 border-gray-300 dark:border-gray-700" />
                {isFetching ? (
                    <div className="text-center py-6 flex flex-col items-center justify-center">
                        <LoadingIcon size="lg" className="mb-2 text-gray-400" />
                        <span>Loading friends...</span>
                    </div>
                ) : friends.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        No friends available
                    </div>
                ) : (
                    <>
                        <div className="max-h-72 overflow-y-auto scrollbar-hide">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {friends.map((friend) => (
                                    <li
                                        key={friend.id}
                                        className={`py-3 flex items-center px-2 ${
                                            selectedFriends.find(
                                                (f) => f.id === friend.id
                                            )
                                                ? "bg-blue-50 dark:bg-blue-900"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } rounded-lg cursor-pointer`}
                                        onClick={() =>
                                            handleFriendToggle(friend)
                                        }
                                    >
                                        <UserAvatar user={friend} size="sm" />
                                        <span className="ml-3 text-gray-900 dark:text-white font-medium">
                                            {friend.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        await Promise.all(
                                            selectedFriends.map((friend) =>
                                                axios.post(
                                                    `/share-post/${post.id}/to/${friend.id}`
                                                )
                                            )
                                        );
                                        toast.success("Post shared!");
                                        if (onShare) onShare(selectedFriends);
                                        onClose();
                                    } catch (error) {
                                        toast.error("Failed to share post");
                                        console.error(
                                            "Error sharing post:",
                                            error
                                        );
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={
                                    selectedFriends.length === 0 || isLoading
                                }
                                style={
                                    isLoading ? { pointerEvents: "none" } : {}
                                }
                            >
                                Send
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SharePostModal;
