import React from "react";

const MessageDeleteModal = ({ onConfirm, onCancel, messageId }) => {
    const handleDelete = (e) => {
        e.preventDefault();
        onConfirm(messageId);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <svg
                            className="w-6 h-6 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white">
                    Delete Message
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    Are you sure you want to delete this message? This action
                    cannot be undone.
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
};

export default MessageDeleteModal;
