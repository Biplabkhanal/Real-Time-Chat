import React from "react";

const UserAvatar = ({ name, avatar, isOnline }) => (
    <div className="relative">
        {avatar ? (
            <div className="w-[3.5rem] h-[3.5rem] rounded-full overflow-hidden">
                <img
                    src={`/storage/${avatar}`}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
        ) : (
            <div className="w-[3.5rem] h-[3.5rem] rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                {name.charAt(0).toUpperCase()}
            </div>
        )}
        {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
        )}
    </div>
);

export default UserAvatar;
