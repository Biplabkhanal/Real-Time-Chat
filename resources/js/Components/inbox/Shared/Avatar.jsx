import React, { useState } from "react";

const Avatar = ({
    user,
    size = "w-8 h-8",
    textSize = "text-sm",
    className = "",
    showOnlineStatus = false,
}) => {
    const [imageError, setImageError] = useState(false);

    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;

        // If avatar is already a full URL, return it
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
            return avatar;
        }

        // If avatar starts with 'storage/', use it as is
        if (avatar.startsWith("storage/")) {
            return `/${avatar}`;
        }

        // If avatar is just a filename, prepend with storage path
        if (avatar.startsWith("avatars/") || avatar.startsWith("images/")) {
            return `/storage/${avatar}`;
        }

        // Default case - assume it's in storage
        return `/storage/avatars/${avatar}`;
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const avatarUrl = getAvatarUrl(user.avatar);
    const shouldShowImage = avatarUrl && !imageError;

    return (
        <div className={`relative ${className}`}>
            <div
                className={`${size} bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden`}
            >
                {shouldShowImage ? (
                    <img
                        src={avatarUrl}
                        alt={user.name}
                        className={`${size} rounded-full object-cover`}
                        onError={handleImageError}
                    />
                ) : (
                    <span
                        className={`${textSize} font-medium text-gray-600 dark:text-gray-300`}
                    >
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                )}
            </div>

            {showOnlineStatus && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            )}
        </div>
    );
};

export default Avatar;
