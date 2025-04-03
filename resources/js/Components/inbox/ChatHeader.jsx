import React from "react";
import UserAvatar from "./UserAvatar";
import UserStatus from "./UserStatus";

const ChatHeader = ({ selectedUser, onlineUsers, lastSeen }) => (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
        <UserAvatar
            name={selectedUser.name}
            isOnline={onlineUsers[selectedUser.id]}
            avatar={selectedUser.avatar}
        />
        <div className="ml-4 flex-1">
            <div className="font-bold text-gray-900 dark:text-white">
                {selectedUser.name}
            </div>
            <UserStatus
                isOnline={onlineUsers[selectedUser.id]}
                lastSeen={lastSeen}
                userId={selectedUser.id}
            />
        </div>
    </div>
);

export default ChatHeader;
