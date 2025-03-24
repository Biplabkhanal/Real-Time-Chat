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
                className="inline-flex flex-col items-center bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700/70 transition-colors"
            >
                <svg
                    className="w-8 h-8 text-blue-400 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span className="text-sm text-white truncate max-w-[120px]">
                    {attachment.name}
                </span>
            </a>
        )}
    </div>
);

export default MessageAttachment;
