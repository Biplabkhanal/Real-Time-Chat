import React from "react";
import { useTheme } from "../customHooks/ThemeProvider";

const ThemeSettings = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: "light", name: "Light", icon: "sun" },
        { id: "dark", name: "Dark", icon: "moon" },
        { id: "system", name: "System", icon: "computer" },
    ];

    return (
        <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Theme Settings
            </h3>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    {themes.map((themeOption) => (
                        <button
                            key={themeOption.id}
                            onClick={() => setTheme(themeOption.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                theme === themeOption.id
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            {themeOption.icon === "sun" && (
                                <svg
                                    className="w-6 h-6 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            )}
                            {themeOption.icon === "moon" && (
                                <svg
                                    className="w-6 h-6 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                            {themeOption.icon === "computer" && (
                                <svg
                                    className="w-6 h-6 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            )}
                            <span className="text-sm">{themeOption.name}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Color Scheme
                    </h4>
                    <div className="flex space-x-2">
                        {["blue", "purple", "green", "red", "amber"].map(
                            (color) => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                                        color === "blue"
                                            ? "bg-blue-500"
                                            : color === "purple"
                                            ? "bg-purple-500"
                                            : color === "green"
                                            ? "bg-green-500"
                                            : color === "red"
                                            ? "bg-red-500"
                                            : "bg-amber-500"
                                    }`}
                                    onClick={() => {
                                        // In a real implementation, you would set an accent color in your theme context
                                        console.log(`Color ${color} selected`);
                                    }}
                                />
                            )
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Color scheme feature coming soon
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;
