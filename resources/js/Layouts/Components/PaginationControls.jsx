import React from "react";

export default function PaginationControls({ currentPage, lastPage, setPage }) {
    if (lastPage <= 1) return null;
    return (
        <div className="flex justify-between items-center p-2 border-t border-gray-700 bg-gray-800">
            <button
                onClick={() => setPage((p) => Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-white text-sm">
                Page {currentPage} of {lastPage}
            </span>
            <button
                onClick={() =>
                    setPage((p) => Math.min(lastPage, currentPage + 1))
                }
                disabled={currentPage === lastPage}
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
