import { memo } from "react";

const UserAvatar = memo(({ user, size = "md", showOnlineStatus = false }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const onlineIndicatorClasses = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4",
    };

    return (
        <div className="relative">
            {user.avatar ? (
                <img
                    src={`/storage/${user.avatar}`}
                    alt={user.name}
                    className={`${sizeClasses[size]} rounded-full object-cover`}
                />
            ) : (
                <div
                    className={`${sizeClasses[size]} rounded-full bg-blue-600 flex items-center justify-center text-white font-bold`}
                >
                    {user.name.charAt(0).toUpperCase()}
                </div>
            )}
            {showOnlineStatus && user.is_online && (
                <div
                    className={`absolute bottom-0 right-0 ${onlineIndicatorClasses[size]} bg-green-500 border-2 border-gray-800 rounded-full`}
                />
            )}
        </div>
    );
});

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
