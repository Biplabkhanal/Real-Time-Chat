import React from "react";
import IconButton from "./IconButton";

const SearchButton = (s) => {
    const searchIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );

    return <IconButton title="Search in conversation" icon={searchIcon} />;
};

export default SearchButton;
