import React from "react";

const ErrorDisplay = ({ error, retryAction }) => (
    <div className="flex justify-center items-center h-full">
        <div className="text-center text-red-500">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <p>{error}</p>
            {retryAction && (
                <button
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    onClick={retryAction}
                >
                    Try Again
                </button>
            )}
        </div>
    </div>
);

export default ErrorDisplay;
