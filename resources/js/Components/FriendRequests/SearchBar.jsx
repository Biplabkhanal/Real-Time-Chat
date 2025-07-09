import { memo } from "react";
import TextInput from "@/Components/TextInput";

const SearchBar = memo(({ searchQuery, onSearchChange, isSearching }) => {
    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">
                Search Users
            </h2>
            <div className="relative">
                <TextInput
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isSearching}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-400"
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
        </div>
    );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
