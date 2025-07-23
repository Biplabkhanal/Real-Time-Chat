import React from "react";

const ActivityHeatmap = ({ renderHeatmap }) => (
    <>
        <div className="relative my-8">
            <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
            >
                <div className="w-full border-t border-gray-300 dark:border-gray-500"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-3 text-md text-gray-400 dark:text-gray-300">
                    Activity Heatmap
                </span>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
            <div className="overflow-x-auto">{renderHeatmap()}</div>
            <div className="mt-3 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 bg-indigo-100 rounded"></div>
                    <span>Low</span>
                    <div className="w-4 h-4 bg-indigo-300 rounded"></div>
                    <span>Medium</span>
                    <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                    <span>High</span>
                    <div className="w-4 h-4 bg-indigo-700 rounded"></div>
                    <span>Very High</span>
                </div>
            </div>
        </div>
    </>
);

export default ActivityHeatmap;
