import React, { useState } from "react";
import MessageOptions from "./MessageOptions";
import MessageContent from "./MessageContent";
import MessageAttachment from "./MessageAttachment";
import MessageTimestamp from "./MessageTimestamp";
import MessageDeleteModal from "../../Modals/MessageDeleteModal";

const Message = ({ message, isCurrentUser, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const toggleDropdown = () => setShowOptions(!showOptions);

    const handleDelete = (e) => {
        e.preventDefault();
        setDeleteModalOpen(true);
        setShowOptions(false);
    };

    const handleDeleteConfirm = (messageId) => {
        onDelete(messageId);
        setDeleteModalOpen(false);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";

        const messageDate = new Date(timestamp);
        const now = new Date();

        // Calculate time difference in milliseconds
        const diffMs = now - messageDate;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        // Format based on how long ago
        if (diffMins < 1) {
            return "Just now";
        } else if (diffMins === 1) {
            return "1 minute ago";
        } else if (diffMins < 60) {
            return `${diffMins} minutes ago`;
        } else if (diffHours === 1) {
            return "1 hour ago";
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            // For older messages, show the actual date
            return messageDate.toLocaleDateString();
        }
    };

    return (
        <div
            className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`relative max-w-md ${
                    isCurrentUser
                        ? "bg-blue-500 text-white rounded-l-lg rounded-br-lg"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-r-lg rounded-bl-lg border border-gray-200 dark:border-gray-700"
                } p-4 shadow`}
            >
                {isCurrentUser && (
                    <MessageOptions
                        onDelete={handleDelete}
                        toggleDropdown={toggleDropdown}
                        showOptions={showOptions}
                    />
                )}

                <MessageContent message={message} />

                {message.attachment && (
                    <MessageAttachment attachment={message.attachment} />
                )}

                <MessageTimestamp
                    time={message.created_at}
                    isCurrentUser={isCurrentUser}
                    formatTime={formatTime}
                />

                {deleteModalOpen && (
                    <MessageDeleteModal
                        messageId={message.id}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setDeleteModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Message;
