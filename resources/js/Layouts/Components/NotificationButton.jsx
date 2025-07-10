import React from "react";

export default function NotificationButton({
    unreadCount,
    onClick,
    isMobile = false,
}) {
    return (
        <button
            onClick={onClick}
            className={`relative ${
                isMobile
                    ? "p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                    : "p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-4"
            }`}
            aria-label="Notifications"
        >
            {unreadCount > 0 && (
                <span
                    className={`absolute -top-1 -right-1 flex ${
                        isMobile ? "h-4 w-4" : "h-5 w-5"
                    }`}
                >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span
                        className={`relative inline-flex rounded-full ${
                            isMobile ? "h-4 w-4" : "h-5 w-5"
                        } bg-indigo-500 justify-center items-center text-xs text-white`}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                </span>
            )}
            <svg
                className={isMobile ? "h-6 w-6" : "h-6 w-6"}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>
        </button>
    );
}
