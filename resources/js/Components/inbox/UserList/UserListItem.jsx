import React from "react";
import UserAvatar from "./UserAvatar";

const UserListItem = ({ user, selectedUser, setSelectedUser, isOnline }) => {
    const handleUserClick = () => {
        if (user.id !== selectedUser?.id) {
            setSelectedUser(user);
        }
    };

    const formatLastMessageTime = (timestamp) => {
        if (!timestamp) return "";

        const messageDate = new Date(timestamp);
        const now = new Date();
        const diffMs = now - messageDate;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 1) {
            return "Just now";
        } else if (diffMins < 60) {
            return `${diffMins}m`;
        } else if (diffHours < 24) {
            return `${diffHours}h`;
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays}d`;
        } else {
            return messageDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    return (
        <div
            onClick={handleUserClick}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                       ${
                           user.id === selectedUser?.id
                               ? "bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500"
                               : "hover:bg-gray-100 dark:hover:bg-gray-700 my-1"
                       }`}
        >
            <UserAvatar
                name={user.name}
                avatar={user.avatar}
                isOnline={isOnline}
                size="w-12 h-12"
                textSize="text-lg"
            />
            <div className="ml-4 flex-1 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                        {user.display_name || user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {user.display_name &&
                        user.display_name !== user.name ? (
                            <span>
                                {user.name} • {user.email}
                            </span>
                        ) : (
                            <span>{user.email}</span>
                        )}
                    </div>
                </div>
                {user.latest_message_at && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">
                        {formatLastMessageTime(user.latest_message_at)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserListItem;
