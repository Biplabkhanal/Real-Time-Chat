import React from "react";

const ConversationStats = ({ stats }) => (
    <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.total_messages}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Messages
            </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.days_talking}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Days Talking
            </p>
        </div>
    </div>
);

export default ConversationStats;
