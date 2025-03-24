import React from "react";

const MessageAttachment = ({ attachment }) => (
    <div className="mt-2 pt-2 border-gray-200 dark:border-gray-700">
        {attachment.type?.startsWith("image/") ? (
            <a href={attachment.url} target="_blank" className="block mt-1">
                <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-h-40 max-w-full rounded"
                />
            </a>
        ) : (
            <a
                href={attachment.url}
                target="_blank"
                className="flex items-center text-sm hover:underline text-blue-300"
            >
                <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                </svg>
                {attachment.name}
            </a>
        )}
    </div>
);

export default MessageAttachment;
