import React, { useEffect, useRef } from "react";
import LoadingSpinner from "@/Components/LoadingSpinner";
import EmptyState from "../../Shared/States/EmptyState";
import ErrorState from "../../Shared/States/ErrorState";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

const ChatMessages = ({
    isLoading,
    isUserSelectionLoading,
    error,
    currentMessages,
    auth,
    getMessages,
    onDeleteMessage,
    onForwardMessage,
    targetScrollRef,
    selectedUser,
    onlineUsers,
    typingUsers = {},
}) => {
    const messagesContainerRef = useRef(null);

    const isSelectedUserTyping =
        selectedUser &&
        Object.keys(typingUsers).some((typingUserId) => {
            const typingUserIdInt = parseInt(typingUserId);
            return typingUserIdInt === selectedUser.id;
        });

    useEffect(() => {
        if (isSelectedUserTyping && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const scrollHeight = container.scrollHeight;
            const height = container.clientHeight;
            const maxScrollTop = scrollHeight - height;

            if (container.scrollTop > maxScrollTop - 100) {
                container.scrollTo({
                    top: scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    }, [isSelectedUserTyping]);

    return (
        <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 "
        >
            {isUserSelectionLoading ? (
                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <LoadingSpinner size="lg" text="Loading conversation..." />
                </div>
            ) : (
                <>
                    {isLoading && currentMessages.length === 0 && (
                        <LoadingSpinner
                            size="lg"
                            message="Loading messages..."
                        />
                    )}

                    {error && (
                        <ErrorState error={error} getMessages={getMessages} />
                    )}

                    {currentMessages.length === 0 && !isLoading && !error && (
                        <EmptyState />
                    )}

                    {currentMessages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                            isCurrentUser={message.sender_id === auth.user.id}
                            onDelete={onDeleteMessage}
                            onForward={onForwardMessage}
                            auth={auth}
                            selectedUser={selectedUser}
                            onlineUsers={onlineUsers}
                        />
                    ))}

                    {isSelectedUserTyping && (
                        <div className="mt-2">
                            <TypingIndicator user={selectedUser} />
                        </div>
                    )}
                </>
            )}
            <span ref={targetScrollRef}></span>
        </div>
    );
};

export default ChatMessages;
