import React from "react";
import moment from "moment";

const ConversationTimeline = ({ stats, currentUser, selectedUser }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Timeline
        </h4>
        <div className="space-y-4">
            {stats.first_message_date && (
                <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            First message
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {moment(stats.first_message_date).format(
                                "MMM D, YYYY"
                            )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            by{" "}
                            {stats.first_message_by === currentUser.id
                                ? "You"
                                : selectedUser.name}
                        </p>
                    </div>
                </div>
            )}
            {stats.latest_message_date && (
                <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Latest message
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {moment(stats.latest_message_date).format(
                                "MMM D, YYYY"
                            )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            by{" "}
                            {stats.latest_message_by === currentUser.id
                                ? "You"
                                : selectedUser.name}
                        </p>
                    </div>
                </div>
            )}
            {stats.busy_day && (
                <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Busiest day
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {moment(stats.busy_day.date).format("MMM D, YYYY")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stats.busy_day.count} messages exchanged
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default ConversationTimeline;
