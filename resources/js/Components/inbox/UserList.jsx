import React, { useMemo } from "react";
import UserListItem from "./UserListItem";

const UserList = ({
    filteredUsers,
    selectedUser,
    setSelectedUser,
    onlineUsers,
}) => {
    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            const aTime = a.updated_at
                ? new Date(a.updated_at)
                : new Date(a.joined_at);
            const bTime = b.updated_at
                ? new Date(b.updated_at)
                : new Date(b.joined_at);
            return bTime - aTime;
        });
    }, [filteredUsers]);

    return (
        <div className="flex-1 overflow-y-auto p-3">
            {sortedUsers.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No contacts found
                </div>
            )}
            <div className="space-y-2 max-h-[calc(100vh-151px)] overflow-y-auto">
                {sortedUsers.map((user) => (
                    <UserListItem
                        key={user.id}
                        user={user}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        isOnline={onlineUsers[user.id]}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserList;
