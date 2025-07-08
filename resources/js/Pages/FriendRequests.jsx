import { useState, useEffect, useCallback, memo } from "react";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import TextInput from "@/Components/TextInput";

const UserCard = memo(
    ({ user, onSendFriendRequest, onCancelFriendRequest, isLoading }) => (
        <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4 mb-3">
                {user.avatar ? (
                    <img
                        src={`/storage/${user.avatar}`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
            </div>
            <div className="flex justify-end">
                {user.is_friend ? (
                    <span className="text-sm text-green-400">Friend</span>
                ) : user.has_sent_request || user.has_pending_request ? (
                    <div className="flex space-x-2">
                        {user.sent_request_id && (
                            <DangerButton
                                onClick={() =>
                                    onCancelFriendRequest(user.sent_request_id)
                                }
                                disabled={isLoading}
                                className="text-xs px-2 py-1 flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                                        Canceling...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-3 h-3 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Cancel
                                    </>
                                )}
                            </DangerButton>
                        )}
                    </div>
                ) : user.has_received_request ? (
                    <span className="text-sm text-blue-400">
                        Request Received
                    </span>
                ) : (
                    <PrimaryButton
                        onClick={() => onSendFriendRequest(user.id)}
                        disabled={isLoading}
                        className="text-sm flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                Sending...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M20 8v6M23 11h-6"
                                    />
                                </svg>
                                Add Friend
                            </>
                        )}
                    </PrimaryButton>
                )}
            </div>
        </div>
    )
);

export default function FriendRequests({
    auth,
    pendingRequests: initialPendingRequests,
    friends: initialFriends,
    csrf_token,
}) {
    const [activeTab, setActiveTab] = useState("addFriend");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState(
        initialPendingRequests || []
    );
    const [friends, setFriends] = useState(initialFriends || []);

    const getCsrfToken = () => {
        if (csrf_token) {
            return csrf_token;
        }

        const metaToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (metaToken) {
            return metaToken;
        }

        console.error("CSRF token not found in props or meta tag");
        return null;
    };

    const refreshCsrfToken = async () => {
        try {
            const response = await fetch("/csrf-token", {
                method: "GET",
                credentials: "same-origin",
            });

            if (response.ok) {
                const data = await response.json();
                const metaTag = document.querySelector(
                    'meta[name="csrf-token"]'
                );
                if (metaTag && data.csrf_token) {
                    metaTag.setAttribute("content", data.csrf_token);
                }
                return true;
            }
        } catch (error) {
            console.error("Failed to refresh CSRF token:", error);
        }
        return false;
    };

    const fetchAllUsers = async () => {
        try {
            const response = await fetch("/users/search");
            const data = await response.json();
            setAllUsers(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const searchUsers = async () => {
        setIsSearching(true);
        try {
            const response = await fetch(
                `/users/search?search=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();
            setSearchResults(data || []);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            if (allUsers.length === 0) {
                fetchAllUsers();
            }
        } else {
            const timeoutId = setTimeout(() => {
                searchUsers();
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery]);

    const sendFriendRequest = useCallback(
        async (userId, retryCount = 0) => {
            setLoadingUsers((prev) => new Set(prev).add(userId));
            try {
                const csrfToken = getCsrfToken();

                if (!csrfToken) {
                    toast.error(
                        "CSRF token not found. Please refresh the page."
                    );
                    return;
                }

                const response = await fetch(`/friend-request/send/${userId}`, {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                if (response.status === 419 && retryCount === 0) {
                    const refreshed = await refreshCsrfToken();
                    if (refreshed) {
                        return sendFriendRequest(userId, 1);
                    } else {
                        toast.error(
                            "CSRF token expired. Please refresh the page and try again."
                        );
                        return;
                    }
                }

                const data = await response.json();

                if (response.ok) {
                    toast.success(data.message);
                    if (searchQuery.trim() === "") {
                        setAllUsers((users) =>
                            users.map((user) =>
                                user.id === userId
                                    ? {
                                          ...user,
                                          has_sent_request: true,
                                          sent_request_id: data.request_id,
                                      }
                                    : user
                            )
                        );
                    } else {
                        setSearchResults((results) =>
                            results.map((user) =>
                                user.id === userId
                                    ? {
                                          ...user,
                                          has_sent_request: true,
                                          sent_request_id: data.request_id,
                                      }
                                    : user
                            )
                        );
                    }
                } else {
                    console.error("Error response:", data);

                    if (response.status === 419 && retryCount === 0) {
                        const refreshed = await refreshCsrfToken();
                        if (refreshed) {
                            return sendFriendRequest(userId, 1);
                        }
                        toast.error(
                            "CSRF token mismatch. Please refresh the page and try again."
                        );
                    } else {
                        toast.error(
                            data.error ||
                                data.message ||
                                "Failed to send friend request"
                        );
                    }
                }
            } catch (error) {
                console.error("Error sending friend request:", error);
                toast.error("Error sending friend request: " + error.message);
            } finally {
                setLoadingUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
            }
        },
        [searchQuery]
    );

    const cancelFriendRequest = useCallback(
        async (requestId, retryCount = 0) => {
            setLoadingUsers((prev) => new Set(prev).add(requestId));
            try {
                const csrfToken = getCsrfToken();

                if (!csrfToken) {
                    toast.error(
                        "CSRF token not found. Please refresh the page."
                    );
                    return;
                }

                const response = await fetch(
                    `/friend-request/cancel/${requestId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "X-CSRF-TOKEN": csrfToken,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 419 && retryCount === 0) {
                    const refreshed = await refreshCsrfToken();
                    if (refreshed) {
                        return cancelFriendRequest(requestId, 1);
                    } else {
                        toast.error(
                            "CSRF token expired. Please refresh the page and try again."
                        );
                        return;
                    }
                }

                const data = await response.json();

                if (response.ok) {
                    toast.success(data.message);

                    // Update the user lists to remove the sent request status
                    const updateUserState = (users) =>
                        users.map((user) =>
                            user.sent_request_id === requestId
                                ? {
                                      ...user,
                                      has_sent_request: false,
                                      sent_request_id: null,
                                  }
                                : user
                        );

                    if (searchQuery.trim() === "") {
                        setAllUsers(updateUserState);
                    } else {
                        setSearchResults(updateUserState);
                    }
                } else {
                    console.error("Error response:", data);

                    if (response.status === 419 && retryCount === 0) {
                        const refreshed = await refreshCsrfToken();
                        if (refreshed) {
                            return cancelFriendRequest(requestId, 1);
                        }
                        toast.error(
                            "CSRF token mismatch. Please refresh the page and try again."
                        );
                    } else {
                        toast.error(
                            data.error ||
                                data.message ||
                                "Failed to cancel friend request"
                        );
                    }
                }
            } catch (error) {
                console.error("Error canceling friend request:", error);
                toast.error("Error canceling friend request: " + error.message);
            } finally {
                setLoadingUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(requestId);
                    return newSet;
                });
            }
        },
        [searchQuery]
    );

    const acceptFriendRequest = async (requestId) => {
        try {
            router.post(
                `/friend-request/accept/${requestId}`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        toast.success("Friend request accepted successfully!");
                        setPendingRequests((prev) =>
                            prev.filter((req) => req.id !== requestId)
                        );
                        if (page.props.friends) {
                            setFriends(page.props.friends);
                        }
                    },
                    onError: (errors) => {
                        console.error(
                            "Error accepting friend request:",
                            errors
                        );
                        const errorMessage =
                            Object.values(errors)[0] ||
                            "Failed to accept friend request";
                        toast.error(errorMessage);
                    },
                }
            );
        } catch (error) {
            console.error("Error accepting friend request:", error);
            toast.error(
                "Error accepting friend request: " +
                    (error.message || "Unknown error")
            );
        }
    };

    const declineFriendRequest = async (requestId) => {
        try {
            router.post(
                `/friend-request/decline/${requestId}`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Friend request declined");
                        setPendingRequests((prev) =>
                            prev.filter((req) => req.id !== requestId)
                        );
                    },
                    onError: (errors) => {
                        console.error(
                            "Error declining friend request:",
                            errors
                        );
                        const errorMessage =
                            Object.values(errors)[0] ||
                            "Failed to decline friend request";
                        toast.error(errorMessage);
                    },
                }
            );
        } catch (error) {
            console.error("Error declining friend request:", error);
            toast.error("Error declining friend request");
        }
    };

    const removeFriend = async (friendId) => {
        try {
            router.delete(`/friend/remove/${friendId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Friend removed successfully");
                    setFriends((prev) =>
                        prev.filter((friend) => friend.id !== friendId)
                    );
                },
                onError: (errors) => {
                    console.error("Error removing friend:", errors);
                    const errorMessage =
                        Object.values(errors)[0] || "Failed to remove friend";
                    toast.error(errorMessage);
                },
            });
        } catch (error) {
            console.error("Error removing friend:", error);
            toast.error("Error removing friend");
        }
    };

    const usersToDisplay = searchQuery.trim() === "" ? allUsers : searchResults;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Friends & Requests
                </h2>
            }
        >
            <Head title="Friends & Requests" />

            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Friends & Requests
                        </h1>
                    </div>
                    {/* Tab Navigation */}
                    <div className="bg-gray-800 rounded-lg p-1 mb-6 flex space-x-1">
                        <button
                            onClick={() => setActiveTab("addFriend")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                                activeTab === "addFriend"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`}
                        >
                            Add Friend
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                                activeTab === "requests"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`}
                        >
                            Friend Requests
                            {pendingRequests.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("friends")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                                activeTab === "friends"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`}
                        >
                            Friends ({friends.length})
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "addFriend" && (
                        <div className="space-y-6">
                            {/* Search Section */}
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h2 className="text-lg font-medium text-white mb-4">
                                    Search Users
                                </h2>
                                <div className="relative">
                                    <TextInput
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search by name or email..."
                                        className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
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
                            </div>

                            {/* Loading State */}
                            {isSearching && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-400 mt-2">
                                        Searching...
                                    </p>
                                </div>
                            )}

                            {/* Search Results or All Users */}
                            {!isSearching && (
                                <div className="bg-gray-900 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-white mb-4">
                                        {searchQuery.trim() === ""
                                            ? "All Users"
                                            : "Search Results"}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {usersToDisplay.map((user) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                onSendFriendRequest={
                                                    sendFriendRequest
                                                }
                                                onCancelFriendRequest={
                                                    cancelFriendRequest
                                                }
                                                isLoading={
                                                    loadingUsers.has(user.id) ||
                                                    loadingUsers.has(
                                                        user.sent_request_id
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>

                                    {/* Empty States */}
                                    {searchQuery.trim() !== "" &&
                                        !isSearching &&
                                        searchResults.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400">
                                                    No users found
                                                </p>
                                            </div>
                                        )}

                                    {searchQuery.trim() === "" &&
                                        !isSearching &&
                                        allUsers.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400">
                                                    No users available to add
                                                </p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "requests" && (
                        <div className="space-y-6">
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h2 className="text-lg font-medium text-white mb-6">
                                    Pending Friend Requests (
                                    {pendingRequests.length})
                                </h2>

                                {pendingRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingRequests.map((request) => (
                                            <div
                                                key={request.id}
                                                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    {request.sender.avatar ? (
                                                        <img
                                                            src={`/storage/${request.sender.avatar}`}
                                                            alt={
                                                                request.sender
                                                                    .name
                                                            }
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                            {request.sender.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-medium text-white">
                                                            {
                                                                request.sender
                                                                    .name
                                                            }
                                                        </h4>
                                                        <p className="text-sm text-gray-400">
                                                            {
                                                                request.sender
                                                                    .email
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(
                                                                request.created_at
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <PrimaryButton
                                                        onClick={() =>
                                                            acceptFriendRequest(
                                                                request.id
                                                            )
                                                        }
                                                        className="text-sm"
                                                    >
                                                        Accept
                                                    </PrimaryButton>
                                                    <DangerButton
                                                        onClick={() =>
                                                            declineFriendRequest(
                                                                request.id
                                                            )
                                                        }
                                                        className="text-sm"
                                                    >
                                                        Decline
                                                    </DangerButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">
                                            No pending friend requests
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "friends" && (
                        <div className="space-y-6">
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h2 className="text-lg font-medium text-white mb-6">
                                    Your Friends ({friends.length})
                                </h2>

                                {friends.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {friends.map((friend) => (
                                            <div
                                                key={friend.id}
                                                className="p-4 bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div className="relative">
                                                        {friend.avatar ? (
                                                            <img
                                                                src={`/storage/${friend.avatar}`}
                                                                alt={
                                                                    friend.name
                                                                }
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                                {friend.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}
                                                        {friend.is_online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white">
                                                            {friend.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-400">
                                                            {friend.is_online
                                                                ? "Online"
                                                                : "Offline"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            router.visit(
                                                                `/message/${friend.id}`
                                                            )
                                                        }
                                                        className="flex-1 text-sm justify-center"
                                                    >
                                                        Message
                                                    </SecondaryButton>
                                                    <DangerButton
                                                        onClick={() =>
                                                            removeFriend(
                                                                friend.id
                                                            )
                                                        }
                                                        className="text-sm"
                                                    >
                                                        Remove
                                                    </DangerButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">
                                            No friends yet. Start by adding some
                                            friends!
                                        </p>
                                        <button
                                            onClick={() =>
                                                setActiveTab("addFriend")
                                            }
                                            className="mt-4 text-blue-400 hover:text-blue-300"
                                        >
                                            Go to Add Friend
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
