import ChatHeader from "@/Components/inbox/ChatHeader";
import ConversationSidebar from "@/Components/inbox/ChatHeader/ConversationSidebar";
import { useMessageHandler } from "@/Components/inbox/customHooks/customHooks,";
import EmptyChatState from "@/Components/inbox/EmptyChatState";
import NoFriendsState from "@/Components/inbox/NoFriendsState";
import AddButton from "@/Components/inbox/icons/AddButton";
import AttachmentPreview from "@/Components/inbox/Messages/AttachmentPreview";
import ChatMessages from "@/Components/inbox/Messages/ChatMessages";
import MessageInput from "@/Components/inbox/Messages/MessageInput";
import UserList from "@/Components/inbox/UserList";
import UserModal from "@/Components/inbox/UserModal";
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

    const targetScrollRef = useRef(null);
    const selectedUserRef = useRef(null);
    const inputRef = useRef(null);
    const {
        isLoading,
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

            getMessages();
            if (inputRef.current) inputRef.current.focus();
        }
    }, [selectedUser]);

    const handleDeleteClick = async (messageId) => {
        try {
            await axios.delete(`/message/${messageId}`);
            await getMessages();
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete message"
            );
        }
    };

    useEffect(() => {
        const channel = window.Echo.private(webSocketChannel);
        channel
            .listen("MessageSent", async () => {
                await getMessages();
            })

            .listen("MessageDeleted", async (event) => {
                if (event.isEntireConversation) {
                    setCurrentMessages([]);
                    toast.info("This conversation has been deleted.");
                } else {
                    await getMessages();
                }
            });

        return () => {
            channel.stopListening("MessageSent");
            channel.stopListening("MessageDeleted");
        };
    }, []);

    const handleUserSelect = (user) => {
        if (selectedUser && selectedUser.id !== user.id) {
            setShowInfoSidebar(false);
        }
        setSelectedUser(user);
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ChatSync - Inbox" />

            {users.length === 0 ? (
                <NoFriendsState />
            ) : (
                <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
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
                                {/* Chat Header */}
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

                                {/* Chat Messages */}
                                <ChatMessages
                                    isLoading={isLoading}
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
                                        isLoading={isLoading}
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
