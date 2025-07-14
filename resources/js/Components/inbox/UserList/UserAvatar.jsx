import React, { useState } from "react";

const UserAvatar = ({
    name,
    avatar,
    isOnline,
    size = "w-[3.5rem] h-[3.5rem]",
    textSize = "text-base",
}) => {
    const [imageError, setImageError] = useState(false);

    const getAvatarSrc = (avatar) => {
        if (!avatar) return null;

        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
            return avatar;
        }

        if (avatar.startsWith("storage/")) {
            return `/${avatar}`;
        }

        return `/storage/${avatar}`;
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const avatarSrc = getAvatarSrc(avatar);
    const shouldShowImage = avatarSrc && !imageError;

    return (
        <div className="relative">
            {shouldShowImage ? (
                <div className={`${size} rounded-full overflow-hidden`}>
                    <img
                        src={avatarSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                </div>
            ) : (
                <div
                    className={`${size} rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold ${textSize}`}
                >
                    {name?.charAt(0)?.toUpperCase() || "?"}
                </div>
            )}
            {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
            )}
        </div>
    );
};

export default UserAvatar;
