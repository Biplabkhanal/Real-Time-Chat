import React from "react";
import UserListItem from "./UserListItem";

const UserList = ({
    filteredUsers,
    selectedUser,
    setSelectedUser,
    onlineUsers,
}) => {
    return (
        <div className="flex-1 overflow-y-auto p-3">
            {filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No contacts found
                </div>
            )}
            <div className="space-y-2">
                {filteredUsers.map((user, key) => (
                    <UserListItem
                        key={key}
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
