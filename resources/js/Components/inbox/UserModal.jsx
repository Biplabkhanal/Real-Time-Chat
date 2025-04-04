import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useFilterUsers } from "./customHooks/customHooks,";
import UserListItemModal from "./UserListItemModal";

const UserModal = ({
    isOpen,
    onClose,
    users,
    onSelect,
    onlineUsers,
    addToUsersList,
}) => {
    const [searchInput, setSearchInput] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUser, setSelectedUser] = useState(null);

    useFilterUsers(searchInput, users, setFilteredUsers);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (typeof onSelect === "function") {
            onSelect(user, true);
        }
        if (typeof onClose === "function") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-96 max-h-[500px] shadow-xl">
                {/* Header */}
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl dark:text-white">New Message</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <SearchBar
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search users..."
                    />
                </div>

                {/* User List */}
                <div className="overflow-y-auto max-h-[300px] p-2">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <UserListItemModal
                                key={user.id}
                                user={user}
                                selectedUser={selectedUser}
                                isOnline={onlineUsers?.[user.id] || false}
                                onUserSelect={handleUserSelect}
                                addToUsersList={addToUsersList}
                            />
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No users found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserModal;
