import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useFilterUsers } from "./customHooks/customHooks,";

const UserModal = ({ isOpen, onClose, users, onSelect }) => {
    const [searchInput, setSearchInput] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);

    useFilterUsers(searchInput, users, setFilteredUsers);

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
                <div className="p-4 border-b dark:border-gray-700">
                    <SearchBar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                    />
                </div>
                {/* Users List */}
                <div className="p-2 overflow-y-auto h-[300px]">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => {
                                    onSelect(user);
                                    onClose();
                                }}
                                className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white  ">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-sm dark:text-white">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Online
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                No users found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserModal;
