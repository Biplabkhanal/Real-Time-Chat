import React from "react";
import ChatHeader from "@/Components/inbox/Chat/Header/ChatHeader";
import ChatMessages from "@/Components/inbox/Chat/Messages/ChatMessages";
import AttachmentPreview from "@/Components/inbox/Chat/Input/AttachmentPreview";
import MessageInput from "@/Components/inbox/Chat/Input/MessageInput";
import EmptyChatState from "@/Components/inbox/Shared/States/EmptyChatState";

const ChatArea = ({
    selectedUser,
    showInfoSidebar,
    setShowInfoSidebar,
    isLoading,
    isUserSelectionLoading,
    error,
    currentMessages,
    auth,
    getMessages,
    handleDeleteClick,
    handleForwardMessage,
    targetScrollRef,
    setMessageInput,
    setAttachments,
    attachments,
    messageInput,
    handleKeyDown,
    isSending,
    handleSendMessage,
    inputRef,
    lastSeen,
    onlineUsers,
    handleConversationDeleted,
    isBlocked,
}) => (
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
                        onConversationDeleted={handleConversationDeleted}
                        showInfoSidebar={showInfoSidebar}
                        setShowInfoSidebar={setShowInfoSidebar}
                    />
                </div>
                <ChatMessages
                    isLoading={isLoading || isUserSelectionLoading}
                    isUserSelectionLoading={isUserSelectionLoading}
                    error={error}
                    currentMessages={currentMessages}
                    auth={auth}
                    getMessages={getMessages}
                    onDeleteMessage={handleDeleteClick}
                    onForwardMessage={handleForwardMessage}
                    targetScrollRef={targetScrollRef}
                    selectedUser={selectedUser}
                />
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    {error && error.includes("send") && (
                        <div className="mb-2 text-sm text-red-500 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <AttachmentPreview
                        attachments={attachments}
                        onRemove={(index) => {
                            const newAttachments = [...attachments];
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
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    )}
                </div>
            </>
        )}
    </div>
);

export default ChatArea;
