import { memo } from "react";

const TabNavigation = memo(({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-1 mb-6 flex space-x-1">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                        activeTab === tab.key
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                >
                    {tab.label}
                    {tab.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {tab.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
});

TabNavigation.displayName = "TabNavigation";

export default TabNavigation;
