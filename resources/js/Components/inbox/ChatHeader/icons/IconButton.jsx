import React from "react";

const IconButton = ({ title, icon, className = "" }) => {
    return (
        <button
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
            title={title}
        >
            {icon}
        </button>
    );
};

export default IconButton;
