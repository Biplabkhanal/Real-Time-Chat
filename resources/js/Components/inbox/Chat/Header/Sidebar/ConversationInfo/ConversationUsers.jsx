import React from "react";

const ConversationUsers = ({ currentUser, selectedUser }) => (
    <div className="flex items-center justify-center space-x-6 py-2">
        <div className="flex flex-col items-center">
            {currentUser.avatar ? (
                <img
                    src={`/storage/${currentUser.avatar}`}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
            ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
            )}
            <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
                You
            </p>
        </div>
        <div className="w-8 h-0 border-t-2 border-gray-300 dark:border-gray-600"></div>
        <div className="flex flex-col items-center">
            {selectedUser.avatar ? (
                <img
                    src={`/storage/${selectedUser.avatar}`}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-full object-cover"
                />
            ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                </div>
            )}
            <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
                {selectedUser.name}
            </p>
        </div>
    </div>
);

export default ConversationUsers;
