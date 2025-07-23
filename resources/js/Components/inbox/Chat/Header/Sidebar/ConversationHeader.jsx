import React from "react";

const ConversationHeader = ({ onClose }) => (
    <div className="py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
            Conversation Info
        </h3>
        <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    </div>
);

export default ConversationHeader;
