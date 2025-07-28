import React, { useState, useEffect } from "react";
import PaginationControls from "./PaginationControls";
import NotificationDeleteModal from "./NotificationDeleteModal";
import { CloseIcon } from "./NavIcons/Icons";
import NotificationList from "./NotificationList";
import { toast } from "react-toastify";

export default function NotificationDisplay({
    showNotifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    handleNotificationClick,
    isMobile,
    onClose,
    setUnreadCount,
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
        const notification = notifications.find((n) => n.id === id);
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
                const data = await res.json();
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                if (
                    typeof setUnreadCount === "function" &&
                    data.unreadCount !== undefined
                ) {
                    setUnreadCount(data.unreadCount);
                }
                toast.success("Notification deleted successfully!");
            } else {
                toast.error("Failed to delete notification!");
            }
        } catch (err) {
            toast.error("Error deleting notification!");
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
                        <NotificationList
                            notifications={notifications}
                            markAsRead={markAsRead}
                            handleNotificationClick={handleNotificationClick}
                            isMobile={true}
                            deleteNotification={handleDeleteClick}
                        />
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
            <NotificationList
                notifications={notifications}
                markAsRead={markAsRead}
                handleNotificationClick={handleNotificationClick}
                isMobile={false}
                deleteNotification={handleDeleteClick}
            />
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
