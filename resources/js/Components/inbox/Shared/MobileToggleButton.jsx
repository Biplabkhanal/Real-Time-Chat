import React from "react";

const MobileToggleButton = ({ showSidebar, toggleSidebar }) => {
    return (
        <button
            className={`md:hidden fixed top-[10rem] ${
                showSidebar ? "right-4" : "left-[0rem]"
            } z-50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center`}
            onClick={toggleSidebar}
            aria-label={showSidebar ? "Hide contacts" : "Show contacts"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
            >
                {showSidebar ? (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                ) : (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                )}
            </svg>
        </button>
    );
};

export default MobileToggleButton;
