import React from "react";

const ConversationContact = ({ selectedUser, setShowExportModal }) => (
    <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Contact
        </h4>
        <div className="space-y-2">
            <button
                className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() =>
                    window.open(`mailto:${selectedUser.email}`, "_blank")
                }
            >
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Email {selectedUser.name}
                </span>
            </button>
            <button
                className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowExportModal(true)}
            >
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Export Conversation
                </span>
            </button>
        </div>
    </div>
);

export default ConversationContact;
