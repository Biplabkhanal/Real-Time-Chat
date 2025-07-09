import React from "react";

const SearchBar = ({ searchInput, setSearchInput }) => {
    return (
        <div className=" border-gray-200 dark:border-gray-700">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search ..."
                    className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <svg
                    className="absolute left-2 top-[0.85rem] h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SearchBar;
