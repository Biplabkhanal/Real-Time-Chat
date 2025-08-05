import ConversationSidebar from "@/Components/inbox/Chat/Header/Sidebar/ConversationSidebar";
import { useMessageHandler } from "@/Components/inbox/hooks/customHooks";
import NoFriendsState from "@/Components/inbox/Shared/States/NoFriendsState";
import UserModal from "@/Components/inbox/UserList/UserModal";
import MobileToggleButton from "@/Components/inbox/Shared/MobileToggleButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import InboxSidebar from "./Inbox/InboxSidebar";
import ChatArea from "./Inbox/ChatArea";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function Inbox({ auth, users, selectedUserId }) {
    const webSocketChannel = `message.${auth.user.id}`;

    const [selectedUser, setSelectedUser] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [lastSeen, setLastSeen] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersWithConversations, setUsersWithConversations] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockStatus, setBlockStatus] = useState({
        isBlocked: false,
        isBlockedByUser: false,
    });
    const [showInfoSidebar, setShowInfoSidebar] = useState(false);
    const [isUserSelectionLoading, setIsUserSelectionLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const targetScrollRef = useRef(null);
    const selectedUserRef = useRef(null);
    const inputRef = useRef(null);
    const onMessageSent = (recipientId) => {
        moveUserToTop(recipientId);
    };

    const {
        isLoading,
        isSending,
        error,
        messageInput,
        setMessageInput,
        attachments,
        setAttachments,
        currentMessages,
        handleSendMessage,
        handleKeyDown,
        getMessages,
        setCurrentMessages,
    } = useMessageHandler(selectedUserRef, inputRef, onMessageSent);

    const scrollToBottom = () => {
        if (targetScrollRef.current) {
            targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        window.scrollToBottom = scrollToBottom;

        return () => {
            delete window.scrollToBottom;
        };
    }, []);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (selectedUser) {
            getMessages();
            if (inputRef.current) inputRef.current.focus();
        }
    }, [selectedUser]);

    useEffect(() => {
        if (currentMessages.length > 0) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [currentMessages]);

    useEffect(() => {
        updateMyStatus();

        const channel = window.Echo.channel("users");
        channel.listen("UserStatusChanged", (e) => {
            setOnlineUsers((prev) => ({
                ...prev,
                [e.user.id]: e.user.is_online,
            }));
        });

        const statusInterval = setInterval(updateMyStatus, 30000);

        return () => {
            clearInterval(statusInterval);
            channel.stopListening("UserStatusChanged");
            window.Echo.leave("users");
        };
    }, []);

    useEffect(() => {
        const handleUnload = async () => {
            try {
                await axios.post("/logout");
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);

    const fetchOnlineStatus = async () => {
        try {
            const response = await axios.get("/users/status");
            const users = response.data.reduce(
                (acc, user) => ({
                    ...acc,
                    [user.id]: user.is_online,
                }),
                {}
            );
            const lastSeenTimes = response.data.reduce(
                (acc, user) => ({
                    ...acc,
                    [user.id]: user.last_seen_at,
                }),
                {}
            );
            setOnlineUsers(users);
            setLastSeen(lastSeenTimes);
        } catch (error) {
            console.error("Failed to fetch online status:", error);
        }
    };

    const updateMyStatus = async () => {
        if (!auth.user) return;

        try {
            await axios.post("/users/status/update");
        } catch (error) {
            console.error("Status update failed:", error);
        }
    };

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (selectedUser) {
            setMessageInput("");
            setAttachments([]);

            getMessages(() => {
                setIsUserSelectionLoading(false);
            }, true);
            if (inputRef.current) inputRef.current.focus();
        }
    }, [selectedUser]);

    const handleDeleteClick = async (messageId) => {
        try {
            const response = await axios.delete(`/message/${messageId}`);
            const successMsg =
                response.data?.success || "Message deleted successfully";
            setCurrentMessages((prevMessages) =>
                prevMessages.filter((msg) => msg.id !== messageId)
            );
            toast.success(successMsg);
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error(
                error.response?.data?.error || "Failed to delete message"
            );
        }
    };

    const handleForwardMessage = (forwardData) => {
        if (forwardData && forwardData.message) {
            toast.success(forwardData.message);
        } else {
            toast.success("Message forwarded successfully");
        }

        if (forwardData && forwardData.updated_conversations) {
            fetchUsersWithConversations(false);
        } else {
            fetchUsersWithConversations(false);
        }
    };
    useEffect(() => {
        if (!window.Echo) {
            console.error(
                "Echo is not available. WebSocket listeners will not be set up."
            );
            return;
        }

        try {
            const channel = window.Echo.private(webSocketChannel);

            channel.listen("MessageSent", (e) => {
                const isMessageForCurrentChat =
                    selectedUserRef.current &&
                    (e.message.sender_id === selectedUserRef.current.id ||
                        e.message.recipient_id === selectedUserRef.current.id);

                if (isMessageForCurrentChat) {
                    if (e.message) {
                        setCurrentMessages((prevMessages) => {
                            const messageExists = prevMessages.some(
                                (msg) => msg.id === e.message.id
                            );
                            if (messageExists) {
                                return prevMessages;
                            }

                            const optimisticIndex = prevMessages.findIndex(
                                (msg) => {
                                    if (
                                        !msg._isOptimistic ||
                                        msg.sender_id !== e.message.sender_id
                                    ) {
                                        return false;
                                    }

                                    const timeDiff = Math.abs(
                                        new Date(msg.created_at) -
                                            new Date(e.message.created_at)
                                    );
                                    if (timeDiff >= 5000) {
                                        return false;
                                    }

                                    if (
                                        msg.attachment &&
                                        e.message.attachment
                                    ) {
                                        const msgAttachment =
                                            typeof msg.attachment === "string"
                                                ? JSON.parse(msg.attachment)
                                                : msg.attachment;
                                        const newMsgAttachment =
                                            typeof e.message.attachment ===
                                            "string"
                                                ? JSON.parse(
                                                      e.message.attachment
                                                  )
                                                : e.message.attachment;

                                        return (
                                            msg.message === e.message.message &&
                                            msgAttachment.name ===
                                                newMsgAttachment.name
                                        );
                                    }

                                    return msg.message === e.message.message;
                                }
                            );

                            if (optimisticIndex !== -1) {
                                const newMessages = [...prevMessages];
                                newMessages[optimisticIndex] = e.message;
                                return newMessages;
                            }

                            return [...prevMessages, e.message];
                        });

                        setTimeout(scrollToBottom, 100);
                    }
                } else {
                    const otherUserId =
                        e.message.sender_id === auth.user.id
                            ? e.message.recipient_id
                            : e.message.sender_id;

                    moveUserToTop(otherUserId);
                    fetchUsersWithConversations(false);
                }
            });

            channel.listen("MessageDeleted", (event) => {
                if (event.isEntireConversation) {
                    setCurrentMessages([]);
                    toast.info("This conversation has been deleted.");
                } else if (event.messageId) {
                    setCurrentMessages((prevMessages) =>
                        prevMessages.filter((msg) => msg.id !== event.messageId)
                    );
                }
            });

            return () => {
                channel.stopListening("MessageSent");
                channel.stopListening("MessageDeleted");
            };
        } catch (error) {
            console.error("Error setting up WebSocket listeners:", error);
        }
    }, [webSocketChannel, auth.user.id]);

    const handleUserSelect = (user) => {
        if (selectedUser && selectedUser.id !== user.id) {
            setShowInfoSidebar(false);
        }
        setIsUserSelectionLoading(true);
        setCurrentMessages([]);
        setSelectedUser(user);

        if (isMobile) {
            setShowSidebar(false);
        }
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const moveUserToTop = (userId) => {
        setUsersWithConversations((prevUsers) => {
            const userIndex = prevUsers.findIndex((user) => user.id === userId);
            if (userIndex > 0) {
                const updatedUsers = [...prevUsers];
                const [user] = updatedUsers.splice(userIndex, 1);
                return [user, ...updatedUsers];
            }
            return prevUsers;
        });
    };

    const fetchUsersWithConversations = async (showLoading = false) => {
        if (showLoading) {
            setIsUsersLoading(true);
        }
        try {
            const response = await axios.get("/users-with-conversations");
            setUsersWithConversations(response.data);
        } catch (error) {
            console.error("Error fetching users with conversations:", error);
            setUsersWithConversations(users);
        } finally {
            if (showLoading) {
                setIsUsersLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUsersWithConversations(true);
    }, []);

    useEffect(() => {
        if (selectedUserId && users && users.length > 0) {
            let userToSelect = usersWithConversations.find(
                (user) => user.id === parseInt(selectedUserId)
            );

            if (!userToSelect) {
                userToSelect = users.find(
                    (user) => user.id === parseInt(selectedUserId)
                );
                if (userToSelect) {
                    setUsersWithConversations((prev) => {
                        const userExists = prev.some(
                            (u) => u.id === userToSelect.id
                        );
                        if (!userExists) {
                            return [userToSelect, ...prev];
                        }
                        return prev;
                    });
                }
            }

            if (userToSelect) {
                setSelectedUser(userToSelect);
                if (window.innerWidth < 768) {
                    setShowSidebar(false);
                }
            }
        }
    }, [selectedUserId, users, usersWithConversations]);

    const handleConversationDeleted = (userId) => {
        setCurrentMessages([]);
        setUsersWithConversations((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
        );

        setSelectedUser(null);
        fetchUsersWithConversations(false);
    };

    const addToUsersList = (user) => {
        const userExists = usersWithConversations.some((u) => u.id === user.id);
        if (!userExists) {
            setUsersWithConversations((prev) => [user, ...prev]);
        }
    };

    useEffect(() => {
        const onlineStatusInterval = setInterval(() => {
            fetchOnlineStatus();
        }, 15000);

        let blockStatusInterval;
        if (selectedUser?.id) {
            checkBlockStatus();

            blockStatusInterval = setInterval(() => {
                checkBlockStatus();
            }, 9000);
        }

        return () => {
            clearInterval(onlineStatusInterval);
            if (blockStatusInterval) {
                clearInterval(blockStatusInterval);
            }
        };
    }, [selectedUser]);

    const checkBlockStatus = async () => {
        try {
            const response = await axios.get(
                `/block-status/${selectedUser.id}`
            );

            const { isBlocked, isBlockedByUser } = response.data;
            setBlockStatus({ isBlocked, isBlockedByUser });
            setIsBlocked(isBlocked || isBlockedByUser);
        } catch (error) {
            console.error("Error checking block status:", error);
        }
    };

    useEffect(() => {
        let pollingInterval;

        if (selectedUser) {
            pollingInterval = setInterval(() => {
                if (!isLoading && selectedUserRef.current) {
                    getMessages(null, false);
                }
            }, 3000);
        }

        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [selectedUser, isLoading]);

    useEffect(() => {
        const checkEchoConnectionStatus = () => {
            let isConnected = false;

            try {
                if (window.Echo && window.Echo.connector) {
                    if (
                        window.Echo.connector.pusher &&
                        window.Echo.connector.pusher.connection &&
                        window.Echo.connector.pusher.connection.state ===
                            "connected"
                    ) {
                        isConnected = true;
                    }
                }
            } catch (error) {
                console.error("Error checking Echo connection:", error);
            }
            window.isWebSocketConnected = isConnected;
        };

        checkEchoConnectionStatus();
        const interval = setInterval(checkEchoConnectionStatus, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const checkIsMobile = () => {
            const mobileView = window.innerWidth < 768;
            setIsMobile(mobileView);

            if (!mobileView) {
                setShowSidebar(true);
            } else if (mobileView && selectedUser) {
                setShowSidebar(false);
            } else if (mobileView && !selectedUser) {
                setShowSidebar(false);
            }
        };

        checkIsMobile();

        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, [selectedUser]);

    useEffect(() => {
        if (!isMobile) {
            setShowSidebar(true);
        } else if (isMobile && selectedUser) {
            setShowSidebar(false);
        } else if (isMobile && !selectedUser) {
            setShowSidebar(false);
        }
    }, [isMobile, selectedUser]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ChatSync - Inbox" />
            {isUsersLoading ? (
                <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-white/80 dark:bg-gray-900">
                    <LoadingSpinner size="xl" text="Loading inbox..." />
                </div>
            ) : users.length === 0 ? (
                <NoFriendsState />
            ) : (
                <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <MobileToggleButton
                        showSidebar={showSidebar}
                        toggleSidebar={toggleSidebar}
                    />
                    <InboxSidebar
                        showSidebar={showSidebar}
                        isUsersLoading={isUsersLoading}
                        usersWithConversations={usersWithConversations}
                        selectedUser={selectedUser}
                        handleUserSelect={handleUserSelect}
                        onlineUsers={onlineUsers}
                        setIsModalOpen={setIsModalOpen}
                        users={users}
                    />
                    <ChatArea
                        selectedUser={selectedUser}
                        showInfoSidebar={showInfoSidebar}
                        setShowInfoSidebar={setShowInfoSidebar}
                        isLoading={isLoading}
                        isUserSelectionLoading={isUserSelectionLoading}
                        error={error}
                        currentMessages={currentMessages}
                        auth={auth}
                        getMessages={getMessages}
                        handleDeleteClick={handleDeleteClick}
                        handleForwardMessage={handleForwardMessage}
                        targetScrollRef={targetScrollRef}
                        setMessageInput={setMessageInput}
                        setAttachments={setAttachments}
                        attachments={attachments}
                        messageInput={messageInput}
                        handleKeyDown={handleKeyDown}
                        isSending={isSending}
                        handleSendMessage={handleSendMessage}
                        inputRef={inputRef}
                        lastSeen={lastSeen}
                        onlineUsers={onlineUsers}
                        handleConversationDeleted={handleConversationDeleted}
                        isBlocked={isBlocked}
                    />
                    {selectedUser && (
                        <ConversationSidebar
                            isOpen={showInfoSidebar}
                            onClose={() => setShowInfoSidebar(false)}
                            selectedUser={selectedUser}
                            currentUser={auth.user}
                        />
                    )}
                </div>
            )}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={filteredUsers}
                onSelect={handleUserSelect}
                onlineUsers={onlineUsers}
                addToUsersList={addToUsersList}
            />
        </AuthenticatedLayout>
    );
}
