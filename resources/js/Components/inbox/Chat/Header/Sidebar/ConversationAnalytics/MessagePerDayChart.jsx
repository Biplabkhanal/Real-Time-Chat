import React from "react";
import { Bar } from "react-chartjs-2";

const MessagePerDayChart = ({ barChartData }) => (
    <>
        <div className="relative">
            <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
            >
                <div className="w-full border-t border-gray-300 dark:border-gray-500"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-3 text-md text-gray-400 dark:text-gray-300">
                    Message Per Day
                </span>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
            <div className="h-64">
                <Bar
                    data={barChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: false,
                            },
                        },
                    }}
                />
            </div>
        </div>
    </>
);

export default MessagePerDayChart;
