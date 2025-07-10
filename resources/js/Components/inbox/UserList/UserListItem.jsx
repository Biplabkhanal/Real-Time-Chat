import React from "react";

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
            <div className="relative">
                {user.avatar ? (
                    <img
                        src={`/storage/${user.avatar}`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                )}
            </div>
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
