import React from "react";
import { CheckIcon, DeleteIcon } from "./NavIcons/Icons";
import LoadingSpinner from "../../Components/LoadingSpinner";

function NotificationList({
    notifications,
    markAsRead,
    handleNotificationClick,
    isMobile,
    deleteNotification,
    loading = false,
}) {
    const handleMarkAsRead = (id, e) => {
        e.stopPropagation();
        markAsRead(id, e);
    };

    if (loading) {
        return <LoadingSpinner size="md" text="Loading notifications..." />;
    }

    if (notifications.length === 0) {
        return (
            <div
                className={`p-4 text-center ${
                    isMobile
                        ? "text-gray-400"
                        : "text-gray-500 dark:text-gray-400"
                }`}
            >
                No notifications
            </div>
        );
    }

    return (
        <div>
            {notifications.map((notification, index) => {
                const isRead = notification.is_read;

                return (
                    <div
                        key={notification.id || index}
                        className={`p-4 border-b ${
                            isMobile
                                ? "border-gray-700 hover:bg-gray-700"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } cursor-pointer relative ${
                            !isRead
                                ? isMobile
                                    ? "bg-gray-700/50 border-l-4 border-l-blue-500"
                                    : "bg-gray-50 dark:bg-gray-700/50 border-l-4 border-l-blue-500"
                                : isMobile
                                ? "bg-transparent opacity-80"
                                : "bg-white dark:bg-gray-800 opacity-80"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {notification.sender?.avatar ? (
                                    <img
                                        src={`/storage/${notification.sender.avatar}`}
                                        alt={
                                            notification.sender?.name || "User"
                                        }
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <div
                                        className={`w-10 h-10 rounded-full ${
                                            isMobile && !notification.is_read
                                                ? "bg-indigo-500"
                                                : isMobile
                                                ? "bg-gray-600"
                                                : "bg-indigo-500"
                                        } flex items-center justify-center text-white font-bold`}
                                    >
                                        {notification.sender?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                            <div className="ml-3 flex-grow">
                                <p
                                    className={`text-sm font-medium ${
                                        !notification.is_read
                                            ? isMobile
                                                ? "text-white"
                                                : "text-gray-900 dark:text-white"
                                            : isMobile
                                            ? "text-gray-300"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {notification.sender?.name || "User"}{" "}
                                    {notification.content}
                                </p>
                                <p
                                    className={`text-xs ${
                                        isMobile
                                            ? "text-gray-400"
                                            : "text-gray-500 dark:text-gray-400"
                                    }`}
                                >
                                    {new Date(
                                        notification.created_at
                                    ).toLocaleString()}
                                </p>
                            </div>

                            {!isRead &&
                                notification.id &&
                                !notification.id
                                    .toString()
                                    .startsWith("temp-") && (
                                    <button
                                        onClick={(e) =>
                                            handleMarkAsRead(notification.id, e)
                                        }
                                        className={`text-xs bg-indigo-600 hover:bg-indigo-700 text-white ${
                                            isMobile ? "py-1 px-2" : "py-1 px-1"
                                        } rounded text-center transition-colors duration-150 ml-2 flex-shrink-0`}
                                        title="Mark as read"
                                    >
                                        <CheckIcon
                                            className={
                                                isMobile ? "h-4 w-4" : "h-3 w-3"
                                            }
                                        />
                                    </button>
                                )}

                            {notification.id &&
                                !notification.id
                                    .toString()
                                    .startsWith("temp-") && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(
                                                notification.id,
                                                e
                                            );
                                        }}
                                        className={`text-xs bg-red-600 hover:bg-red-700 text-white ${
                                            isMobile ? "py-1 px-2" : "py-1 px-1"
                                        } rounded text-center transition-colors duration-150 ml-2 flex-shrink-0`}
                                        title="Delete notification"
                                    >
                                        <DeleteIcon
                                            className={
                                                isMobile ? "h-4 w-4" : "h-3 w-3"
                                            }
                                        />
                                    </button>
                                )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default NotificationList;
