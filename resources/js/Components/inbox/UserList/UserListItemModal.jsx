import React from "react";
import UserAvatar from "./UserAvatar";

const UserListItemModal = ({
    user,
    selectedUser,
    setSelectedUser,
    onClose,
    isOnline,
    onUserSelect,
    addToUsersList,
}) => {
    const handleUserSelect = () => {
        if (typeof setSelectedUser === "function") {
            setSelectedUser(user);
        }
        if (typeof addToUsersList === "function") {
            addToUsersList(user);
        }
        if (typeof onUserSelect === "function") {
            onUserSelect(user);
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    return (
        <div
            onClick={handleUserSelect}
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
            <div className="ml-4 flex-1">
                <div className="text-sm text-gray-900 dark:text-white ">
                    {user.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {user.email}
                </div>
            </div>
        </div>
    );
};

export default UserListItemModal;
