import { memo } from "react";

const UserAvatar = memo(
    ({ user = {}, size = "md", showOnlineStatus = false }) => {
        const sizeClasses = {
            xs: "w-3 h-3",
            sm: "w-8 h-8",
            md: "w-12 h-12",
            lg: "w-16 h-16",
        };

        const onlineIndicatorClasses = {
            xs: "w-2 h-2",
            sm: "w-3 h-3",
            md: "w-4 h-4",
        };

        const avatar = user && user.avatar;
        const name = user && user.name ? user.name : "U";
        const initial = name.charAt(0).toUpperCase();

        return (
            <div className="relative">
                {avatar ? (
                    <img
                        src={`/storage/${avatar}`}
                        alt={name}
                        className={`${sizeClasses[size]} rounded-full object-cover`}
                    />
                ) : (
                    <div
                        className={`${
                            sizeClasses[size]
                        } rounded-full bg-blue-600 flex items-center justify-center text-white font-bold${
                            size === "xs" ? " text-[9px]" : ""
                        }`}
                    >
                        {initial}
                    </div>
                )}
                {showOnlineStatus && user && user.is_online && (
                    <div
                        className={`absolute bottom-0 right-0 ${onlineIndicatorClasses[size]} bg-green-500 border-2 border-none rounded-full`}
                    />
                )}
            </div>
        );
    }
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
