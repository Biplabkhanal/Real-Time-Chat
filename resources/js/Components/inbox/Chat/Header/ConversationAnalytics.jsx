import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const getColorForValue = (value, maxValue) => {
    const intensity = Math.min(Math.max(value / maxValue, 0), 1);
    const r = Math.round(79 - intensity * 50);
    const g = Math.round(70 - intensity * 40);
    const b = Math.round(229);
    return `rgb(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
};

const ConversationAnalytics = ({ userId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/conversations/${userId}/analytics`
                );
                setAnalyticsData(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError(
                    "Failed to load analytics data. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAnalytics();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                <p>{error}</p>
                <button
                    className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="p-4 text-center text-gray-500">
                No analytics data available
            </div>
        );
    }

    const { messagesByDay, messageDistribution, messagesByHour } =
        analyticsData;

    // Configure chart data
    const barChartData = {
        labels: messagesByDay.labels,
        datasets: [
            {
                label: "Messages",
                data: messagesByDay.data,
                backgroundColor: "rgba(79, 70, 229, 0.6)",
                borderColor: "rgba(79, 70, 229, 1)",
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: messageDistribution.labels,
        datasets: [
            {
                data: messageDistribution.data,
                backgroundColor: [
                    "rgba(79, 70, 229, 0.6)",
                    "rgba(235, 100, 50, 0.6)",
                ],
                borderColor: ["rgba(79, 70, 229, 1)", "rgba(235, 100, 50, 1)"],
                borderWidth: 1,
            },
        ],
    };
    const renderHeatmap = () => {
        if (!analyticsData || !analyticsData.heatmapData) return null;

        const { data, daysOfWeek } = analyticsData.heatmapData;

        // Find the max value for color scaling
        let maxValue = 0;
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                maxValue = Math.max(maxValue, data[day][hour]);
            }
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                Day / Hour
                            </th>
                            {[...Array(24)].map((_, hour) => (
                                <th
                                    key={hour}
                                    className="px-1 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-8"
                                >
                                    {hour % 12 === 0 ? 12 : hour % 12}
                                    {hour < 12 ? "am" : "pm"}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {daysOfWeek.map((day, dayIndex) => (
                            <tr key={day}>
                                <td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {day}
                                </td>
                                {[...Array(24)].map((_, hour) => {
                                    const value = data[dayIndex][hour];
                                    return (
                                        <td
                                            key={hour}
                                            className="px-1 py-1 text-center"
                                            style={{
                                                position: "relative",
                                            }}
                                        >
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded"
                                                style={{
                                                    backgroundColor:
                                                        getColorForValue(
                                                            value,
                                                            maxValue
                                                        ),
                                                }}
                                                title={`${day} ${hour}:00 - ${value} messages`}
                                            >
                                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                    {value > 0 ? value : ""}
                                                </span>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 space-y-6 overflow-y-auto h-full">
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

            <div className="relative">
                <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                >
                    <div className="w-full border-t border-gray-300 dark:border-gray-500"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-gray-900 px-3 text-md text-gray-400 dark:text-gray-300">
                        Message Distribution
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
                <div className="h-64">
                    <Pie
                        data={pieChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            </div>
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
        </div>
    );
};

export default ConversationAnalytics;
