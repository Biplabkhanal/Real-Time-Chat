import React from "react";

const MessageContent = ({ message, isCurrentUser }) => {
    const parseMessage = (text) => {
        const bracketRegex = /^(.*?)\s*\[([^\]]+)\]$/;
        const match = text.match(bracketRegex);

        if (match) {
            return {
                originalMessage: match[1].trim(),
                optionalMessage: match[2].trim(),
            };
        }

        return {
            originalMessage: text,
            optionalMessage: null,
        };
    };

    const { originalMessage, optionalMessage } = parseMessage(message.message);

    return (
        <div>
            {message.forwarded_from && (
                <div className="mb-2">
                    <div
                        className={`text-xs flex items-center mb-1 mr-3 ${
                            isCurrentUser
                                ? "text-gray-200 dark:text-gray-300"
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
                    {optionalMessage && (
                        <div
                            className={`text-xs italic mb-2 px-3 border-l-2 py-1 break-words break-all overflow-wrap-anywhere whitespace-pre-wrap max-w-full ${
                                isCurrentUser
                                    ? "border-blue-300 text-blue-100 bg-blue-800/20"
                                    : "border-gray-300 text-gray-600 bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700/50"
                            }`}
                        >
                            "{optionalMessage}"
                        </div>
                    )}
                </div>
            )}
            <p className="break-words break-all overflow-wrap-anywhere whitespace-pre-wrap max-w-full mr-2">
                {originalMessage}
            </p>
        </div>
    );
};

export default MessageContent;
