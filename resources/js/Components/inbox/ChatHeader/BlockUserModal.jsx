import React from "react";

const BlockUserModal = ({
    onConfirm,
    onCancel,
    userId,
    isBlocked,
    userName,
}) => {
    const handleBlockAction = (e) => {
        e.preventDefault();
        onConfirm(userId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div
                        className={`${
                            isBlocked
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                        } p-2 rounded-full`}
                    >
                        {isBlocked ? (
                            <svg
                                className="w-6 h-6 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
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
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white">
                    {isBlocked ? `Unblock ${userName}` : `Block ${userName}`}
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    {isBlocked
                        ? `Are you sure you want to unblock ${userName}? You will be able to exchange messages again.`
                        : `Are you sure you want to block ${userName}? You won't be able to exchange messages until you unblock them.`}
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
                        onClick={handleBlockAction}
                        className={`px-4 py-2 ${
                            isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                        } text-white text-sm font-medium rounded-md transition-colors`}
                    >
                        {isBlocked ? "Unblock" : "Block"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockUserModal;
