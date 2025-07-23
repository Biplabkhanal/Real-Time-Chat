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
import MessagePerDayChart from "./MessagePerDayChart";
import MessageDistributionChart from "./MessageDistributionChart";
import ActivityHeatmap from "./ActivityHeatmap";
import HeatmapTable from "./HeatmapTable";

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

    const { messagesByDay, messageDistribution } = analyticsData;

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
        return (
            <HeatmapTable
                heatmapData={analyticsData.heatmapData}
                getColorForValue={getColorForValue}
            />
        );
    };

    return (
        <div className="p-4 space-y-6 overflow-y-auto h-full">
            <MessagePerDayChart barChartData={barChartData} />

            <MessageDistributionChart pieChartData={pieChartData} />

            <ActivityHeatmap renderHeatmap={renderHeatmap} />
        </div>
    );
};

export default ConversationAnalytics;
