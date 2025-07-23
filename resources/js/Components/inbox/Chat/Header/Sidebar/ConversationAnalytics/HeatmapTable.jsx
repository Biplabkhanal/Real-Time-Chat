import React from "react";

const HeatmapTable = ({ heatmapData, getColorForValue }) => {
    if (!heatmapData) return null;
    const { data, daysOfWeek } = heatmapData;
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
                                        style={{ position: "relative" }}
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

export default HeatmapTable;
