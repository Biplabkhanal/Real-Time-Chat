import React from "react";
import UserAvatar from "./UserAvatar";

const UserListItem = ({ user, selectedUser, setSelectedUser, isOnline }) => {
    const handleUserClick = () => {
        if (user.id !== selectedUser?.id) {
            setSelectedUser(user);
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
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.email}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserListItem;
