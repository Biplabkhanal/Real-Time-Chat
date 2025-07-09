import { memo, useRef, useCallback } from "react";
import TextInput from "@/Components/TextInput";
import { SearchIcon } from "./icons";

const SearchBar = memo(({ searchQuery, onSearchChange, isSearching }) => {
    const inputRef = useRef(null);

    const handleChange = useCallback(
        (e) => {
            onSearchChange(e.target.value);
        },
        [onSearchChange]
    );

    const handleContainerClick = (e) => {
        if (inputRef.current && e.target !== inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">
                Search Users
            </h2>
            <div className="relative" onClick={handleContainerClick}>
                <TextInput
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
