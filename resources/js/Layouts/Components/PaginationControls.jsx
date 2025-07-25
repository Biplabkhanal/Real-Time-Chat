import React from "react";

export default function PaginationControls({ currentPage, lastPage, setPage }) {
    if (lastPage <= 1) return null;
    return (
        <div className="flex flex-row justify-between items-center gap-2 p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
                onClick={() => setPage((p) => Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50 transition-colors duration-150"
            >
                Prev
            </button>
            <span className="text-gray-800 dark:text-white text-sm">
                Page {currentPage} of {lastPage}
            </span>
            <button
                onClick={() =>
                    setPage((p) => Math.min(lastPage, currentPage + 1))
                }
                disabled={currentPage === lastPage}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50 transition-colors duration-150"
            >
                Next
            </button>
        </div>
    );
}
