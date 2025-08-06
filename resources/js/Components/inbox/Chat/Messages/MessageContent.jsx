import React from "react";

const MessageContent = ({ message, isCurrentUser }) => (
    <div>
        {message.forwarded_from && (
            <div
                className={`text-xs  flex items-center mr-2  ${
                    isCurrentUser
                        ? " text-gray-200 dark:text-gray-300"
                        : "text-gray-500 dark:text-gray-400"
                }`}
            >
                <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                </svg>
                Forwarded
            </div>
        )}
        <p className="break-words break-all overflow-wrap-anywhere whitespace-pre-wrap max-w-full mr-2">
            {message.message}
        </p>
    </div>
);

export default MessageContent;
