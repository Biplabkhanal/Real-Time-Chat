import React, { useState, useEffect } from "react";
import PaginationControls from "./PaginationControls";
import NotificationDeleteModal from "./NotificationDeleteModal";
import { DeleteIcon, CloseIcon, CheckIcon } from "./NavIcons/Icons";

export default function NotificationDisplay({
    showNotifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    handleNotificationClick,
    isMobile,
    onClose,
}) {
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setNotificationToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async (id) => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        try {
            const res = await fetch(`/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...(token ? { "X-CSRF-TOKEN": token } : {}),
                },
            });
            if (res.ok) {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            } else {
                alert("Failed to delete notification");
            }
        } catch (err) {
            alert("Error deleting notification");
        } finally {
            setShowDeleteModal(false);
            setNotificationToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setNotificationToDelete(null);
    };

    useEffect(() => {
        if (showNotifications) {
            fetch(`/notifications?page=${page}`)
                .then((res) => res.json())
                .then((data) => {
                    setNotifications(data.notifications.data);
                    setPagination({
                        current_page: data.notifications.current_page,
                        last_page: data.notifications.last_page,
                    });
                });
        }
    }, [showNotifications, page]);

    if (!showNotifications) return null;

    if (isMobile) {
        return (
            <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4">
                <div className="notification-container bg-gray-800 border border-gray-700 rounded-md shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <div className="sticky top-0 bg-gray-800 flex items-center justify-between p-4 border-b border-gray-700 shadow-md z-10">
                        <h3 className="text-lg font-semibold text-white">
                            Notifications
                        </h3>
                        <div className="flex space-x-3 items-center">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md transition-colors duration-150"
                                >
                                    Mark all as read
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors duration-150"
                                aria-label="Close"
                            >
                                <CloseIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="max-h-[calc(80vh-4rem)] overflow-y-auto">
                        {renderNotificationList(
                            notifications,
                            markAsRead,
                            handleNotificationClick,
                            true,
                            handleDeleteClick
                        )}
                    </div>
                    <PaginationControls
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_page}
                        setPage={setPage}
                    />
                </div>
                <NotificationDeleteModal
                    show={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    notificationId={notificationToDelete}
                />
            </div>
        );
    }

    return (
        <div className="notification-container absolute mt-2 w-[23rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-y-auto right-0 sm:right-4 md:right-8 lg:right-3  transition-all duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                </h3>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            {renderNotificationList(
                notifications,
                markAsRead,
                handleNotificationClick,
                false,
                handleDeleteClick
            )}
            <PaginationControls
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                setPage={setPage}
            />
            <NotificationDeleteModal
                show={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                notificationId={notificationToDelete}
            />
        </div>
    );
}

function renderNotificationList(
    notifications,
    markAsRead,
    handleNotificationClick,
    isMobile,
    deleteNotification
) {
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
            {notifications.map((notification, index) => (
                <div
                    key={notification.id || index}
                    className={`p-4 border-b ${
                        isMobile
                            ? "border-gray-700 hover:bg-gray-700"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } cursor-pointer relative ${
                        !notification.is_read
                            ? isMobile
                                ? "bg-gray-700/50 border-l-4 border-l-blue-500"
                                : "bg-gray-50 dark:bg-gray-700/50 border-l-4 border-l-blue-500"
                            : "opacity-80"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {notification.sender?.avatar ? (
                                <img
                                    src={`/storage/${notification.sender.avatar}`}
                                    alt={notification.sender?.name || "User"}
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
                        {/* Mark as read button */}
                        {!notification.is_read &&
                            notification.id &&
                            !notification.id.toString().startsWith("temp-") && (
                                <button
                                    onClick={(e) =>
                                        markAsRead(notification.id, e)
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
                        {/* Delete button */}
                        {notification.id &&
                            !notification.id.toString().startsWith("temp-") && (
                                <button
                                    onClick={(e) =>
                                        deleteNotification(notification.id, e)
                                    }
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
            ))}
        </div>
    );
}
