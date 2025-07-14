import React from "react";

const ValidationErrorModal = ({ onClose, title, message }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                        <svg
                            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    {message}
                </p>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ValidationErrorModal;
