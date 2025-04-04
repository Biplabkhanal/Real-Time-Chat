import React from "react";

const TabNavigation = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 ">
            <nav className="flex space-x-7" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        } whitespace-nowrap py-1 px-1 border-b-2 font-medium text-sm`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabNavigation;
