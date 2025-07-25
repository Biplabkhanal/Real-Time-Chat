import React, { useEffect } from "react";
import { DeleteIcon } from "./NavIcons/Icons";

function NotificationDeleteModal({
    onConfirm,
    onCancel,
    notificationId,
    show,
}) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [show]);

    const handleDelete = (e) => {
        e.preventDefault();
        onConfirm(notificationId);
    };
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <DeleteIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white">
                    Delete Notification
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    Are you sure you want to delete this notification? This
                    action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onCancel();
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotificationDeleteModal;
