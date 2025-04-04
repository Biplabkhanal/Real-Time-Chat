import React, { useMemo } from "react";
import UserListItem from "./UserListItem";

const UserList = ({
    filteredUsers,
    selectedUser,
    setSelectedUser,
    onlineUsers,
}) => {
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
