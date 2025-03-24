import React from "react";

const UserAvatar = ({ name, isOnline }) => (
    <div className="relative">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
            {name.charAt(0).toUpperCase()}
        </div>
        {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
        )}
    </div>
);

export default UserAvatar;
