import React from "react";
import { useTheme } from "../../hooks/ThemeProvider";
import {
    SunIcon,
    MoonIcon,
    ComputerIcon,
} from "@/Components/Welcome/Navigation/ThemeIcon";

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
                Change Theme
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
                                <SunIcon className="w-6 h-6 mb-2" />
                            )}
                            {themeOption.icon === "moon" && (
                                <MoonIcon className="w-6 h-6 mb-2" />
                            )}
                            {themeOption.icon === "computer" && (
                                <ComputerIcon className="w-6 h-6 mb-2" />
                            )}
                            <span className="text-sm">{themeOption.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;
