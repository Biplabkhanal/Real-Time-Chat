import { useState, useEffect, useCallback } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

export const useFriendRequestsLogic = (
    initialPendingRequests,
    initialFriends,
    csrf_token
) => {
    const [activeTab, setActiveTab] = useState("addFriend");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(new Set());
    const [acceptingUsers, setAcceptingUsers] = useState(new Set());
    const [decliningUsers, setDecliningUsers] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState(
        initialPendingRequests || []
    );
    const [friends, setFriends] = useState(initialFriends || []);
    const [loading, setLoading] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [loadingAddFriend, setLoadingAddFriend] = useState(true);

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
        } finally {
            setLoading(false);
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
            setIsSearching(false);
            if (allUsers.length === 0) {
                fetchAllUsers();
            }
        } else {
            setIsSearching(true);
            const timeoutId = setTimeout(() => {
                searchUsers();
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (activeTab === "requests") {
            const timer = setTimeout(() => {
                setLoadingRequests(false);
            }, 500);
            return () => clearTimeout(timer);
        } else if (activeTab === "friends") {
            const timer = setTimeout(() => {
                setLoadingFriends(false);
            }, 500);
            return () => clearTimeout(timer);
        } else if (activeTab === "addFriend") {
            const timer = setTimeout(() => {
                setLoadingAddFriend(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [activeTab]);

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
        setAcceptingUsers((prev) => new Set(prev).add(requestId));
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

                        const updateUserState = (users) =>
                            users.map((user) =>
                                user.received_request_id === requestId
                                    ? {
                                          ...user,
                                          has_received_request: false,
                                          received_request_id: null,
                                          is_friend: true,
                                      }
                                    : user
                            );

                        if (searchQuery.trim() === "") {
                            setAllUsers(updateUserState);
                        } else {
                            setSearchResults(updateUserState);
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
                    onFinish: () => {
                        setAcceptingUsers((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(requestId);
                            return newSet;
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error accepting friend request:", error);
            toast.error(
                "Error accepting friend request: " +
                    (error.message || "Unknown error")
            );
            setAcceptingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const declineFriendRequest = async (requestId) => {
        setDecliningUsers((prev) => new Set(prev).add(requestId));
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
                    onFinish: () => {
                        setDecliningUsers((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(requestId);
                            return newSet;
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error declining friend request:", error);
            toast.error("Error declining friend request");
            setDecliningUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const removeFriend = async (friendId) => {
        setLoadingUsers((prev) => new Set(prev).add(friendId));
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
                onFinish: () => {
                    setLoadingUsers((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(friendId);
                        return newSet;
                    });
                },
            });
        } catch (error) {
            console.error("Error removing friend:", error);
            toast.error("Error removing friend");
            setLoadingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(friendId);
                return newSet;
            });
        }
    };

    const usersToDisplay = searchQuery.trim() === "" ? allUsers : searchResults;

    const handleTabChange = (newTab) => {
        if (newTab === "requests") {
            setLoadingRequests(true);
        } else if (newTab === "friends") {
            setLoadingFriends(true);
        } else if (newTab === "addFriend") {
            setLoadingAddFriend(true);
        }

        setActiveTab(newTab);
    };

    return {
        activeTab,
        setActiveTab: handleTabChange,
        searchQuery,
        setSearchQuery,
        searchResults,
        allUsers,
        isSearching,
        loadingUsers,
        acceptingUsers,
        decliningUsers,
        pendingRequests,
        friends,
        loading,
        loadingRequests,
        loadingFriends,
        loadingAddFriend,
        usersToDisplay,
        sendFriendRequest,
        cancelFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
    };
};
