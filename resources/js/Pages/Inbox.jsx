import ChatHeader from "@/Components/inbox/Chat/Header/ChatHeader";
import ConversationSidebar from "@/Components/inbox/Chat/Header/ConversationSidebar";
import { useMessageHandler } from "@/Components/inbox/hooks/customHooks";
import EmptyChatState from "@/Components/inbox/Shared/States/EmptyChatState";
import NoFriendsState from "@/Components/inbox/Shared/States/NoFriendsState";
import AddButton from "@/Components/inbox/Shared/Icons/AddButton";
import AttachmentPreview from "@/Components/inbox/Chat/Input/AttachmentPreview";
import ChatMessages from "@/Components/inbox/Chat/Messages/ChatMessages";
import MessageInput from "@/Components/inbox/Chat/Input/MessageInput";
import UserList from "@/Components/inbox/UserList/UserList";
import UserModal from "@/Components/inbox/UserList/UserModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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
    const [showSidebar, setShowSidebar] = useState(false); // Default to hiding sidebar on mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Track if current view is mobile

    const targetScrollRef = useRef(null);
    const selectedUserRef = useRef(null);
    const inputRef = useRef(null);
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
    } = useMessageHandler(selectedUserRef, inputRef);

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
            await axios.delete(`/message/${messageId}`);
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete message"
            );
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
                    ((e.user.id === selectedUserRef.current.id &&
                        e.message.recipient_id === auth.user.id) ||
                        (e.message.sender_id === selectedUserRef.current.id &&
                            e.message.recipient_id === auth.user.id));

                if (isMessageForCurrentChat) {
                    if (e.message && e.message.sender_id !== auth.user.id) {
                        setCurrentMessages((prevMessages) => {
                            const messageExists = prevMessages.some(
                                (msg) => msg.id === e.message.id
                            );
                            if (messageExists) {
                                return prevMessages;
                            }
                            return [...prevMessages, e.message];
                        });

                        setTimeout(scrollToBottom, 100);
                    }
                } else {
                    fetchUsersWithConversations();
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

    const fetchUsersWithConversations = async () => {
        setIsUsersLoading(true);
        try {
            const response = await axios.get("/users-with-conversations");
            setUsersWithConversations(response.data);
        } catch (error) {
            console.error("Error fetching users with conversations:", error);
            setUsersWithConversations(users);
        } finally {
            setIsUsersLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersWithConversations();
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
        fetchUsersWithConversations();
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

            {users.length === 0 ? (
                <NoFriendsState />
            ) : (
                <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {/* Mobile Toggle Button */}
                    <button
                        className={`md:hidden fixed top-[10rem] ${
                            showSidebar ? "right-4" : "left-[0rem]"
                        } z-50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center`}
                        onClick={toggleSidebar}
                        aria-label={
                            showSidebar ? "Hide contacts" : "Show contacts"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            {showSidebar ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Sidebar */}
                    <div
                        className={`${
                            showSidebar ? "translate-x-0" : "-translate-x-full"
                        } md:translate-x-0 md:w-1/4 w-full md:static fixed inset-y-0 left-0 z-40
                        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                        flex flex-col transition-transform duration-300 ease-in-out shadow-lg md:shadow-none`}
                    >
                        <div className="px-4 py-[1.64rem] bg-gray-50 dark:bg-gray-900 font-bold text-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-gray-800 dark:text-white">
                                    Chats
                                </h2>
                                {isUsersLoading ? (
                                    <div className="w-6 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                ) : (
                                    <span className="bg-blue-500 text-white text-xs px-1 py-0 rounded-full">
                                        {usersWithConversations.length}
                                    </span>
                                )}
                            </div>
                            <AddButton onClick={() => setIsModalOpen(true)} />
                            <UserModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                users={filteredUsers}
                                onSelect={handleUserSelect}
                                onlineUsers={onlineUsers}
                                addToUsersList={addToUsersList}
                            />
                        </div>

                        {/* Contact List */}
                        <UserList
                            filteredUsers={usersWithConversations}
                            selectedUser={selectedUser}
                            setSelectedUser={handleUserSelect}
                            onlineUsers={onlineUsers}
                            isLoading={isUsersLoading}
                        />
                    </div>

                    {/* Chat Area */}
                    <div
                        className={`flex flex-col ${
                            showInfoSidebar ? "w-[50%]" : "flex-1"
                        } bg-gray-50 dark:bg-gray-900`}
                    >
                        {!selectedUser ? (
                            <EmptyChatState />
                        ) : (
                            <>
                                <div className="relative">
                                    <ChatHeader
                                        selectedUser={selectedUser}
                                        onlineUsers={onlineUsers}
                                        lastSeen={lastSeen}
                                        auth={auth}
                                        onConversationDeleted={
                                            handleConversationDeleted
                                        }
                                        showInfoSidebar={showInfoSidebar}
                                        setShowInfoSidebar={setShowInfoSidebar}
                                    />
                                </div>

                                {/* Chat Messages */}
                                <ChatMessages
                                    isLoading={
                                        isLoading || isUserSelectionLoading
                                    }
                                    isUserSelectionLoading={
                                        isUserSelectionLoading
                                    }
                                    error={error}
                                    currentMessages={currentMessages}
                                    auth={auth}
                                    getMessages={getMessages}
                                    onDeleteMessage={handleDeleteClick}
                                    targetScrollRef={targetScrollRef}
                                />

                                {/* Message Input */}
                                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                    {error && error.includes("send") && (
                                        <div className="mb-2 text-sm text-red-500 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    {/* Attachments preview */}
                                    <AttachmentPreview
                                        attachments={attachments}
                                        onRemove={(index) => {
                                            const newAttachments = [
                                                ...attachments,
                                            ];
                                            newAttachments.splice(index, 1);
                                            setAttachments(newAttachments);
                                        }}
                                    />

                                    <MessageInput
                                        inputRef={inputRef}
                                        messageInput={messageInput}
                                        setMessageInput={setMessageInput}
                                        handleKeyDown={handleKeyDown}
                                        isLoading={isSending}
                                        attachments={attachments}
                                        setAttachments={setAttachments}
                                        sendMessage={handleSendMessage}
                                        selectedUser={selectedUser}
                                    />
                                    {!isBlocked && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                            Press Enter to send, Shift+Enter for
                                            new line
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
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
        </AuthenticatedLayout>
    );
}
