import React from "react";
import moment from "moment";
import {
    BusyDayIcon,
    FirstMessageIcon,
    LatestMessageIcon,
} from "../icons/Icons";

const ConversationTimeline = ({ stats, currentUser, selectedUser }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Timeline
        </h4>
        <div className="space-y-4">
            {stats.first_message_date && (
                <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FirstMessageIcon />
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
                        <LatestMessageIcon />
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
                        <BusyDayIcon />
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
