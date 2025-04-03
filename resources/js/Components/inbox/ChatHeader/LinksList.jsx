import React from "react";

const LinksList = ({ files }) => {
    if (files.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No links shared
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => window.open(file.url, "_blank")}
                >
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded mr-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.title || file.url}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(file.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LinksList;
