import React, { useMemo } from "react";
import UserListItem from "./UserListItem";

const UserListSkeleton = () => (
    <div className="flex items-center p-3 rounded-lg animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        </div>
    </div>
);

const UserList = ({
    filteredUsers,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="flex-1 overflow-y-auto p-3">
                {[...Array(5)].map((_, index) => (
                    <UserListSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (filteredUsers.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-3">
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">
                        Click the "+" button to start a new chat
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-3">
            {filteredUsers.map((user) => (
                <UserListItem
                    key={user.id}
                    user={user}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    isOnline={onlineUsers[user.id]}
                />
            ))}
        </div>
    );
};
export default UserList;
