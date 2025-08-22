import React, { useEffect } from "react";
import { CancelIcon } from "./FeedIcon";

const PostDeleteModal = ({ open, onConfirm, onCancel, postId }) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleDelete = (e) => {
        e.preventDefault();
        onConfirm(postId);
    };
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm mx-2 sm:mx-auto flex flex-col items-center relative">
                <button
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={onCancel}
                    aria-label="Close"
                >
                    <CancelIcon className="w-5 h-5 text-gray-500" />
                </button>
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <svg
                            className="w-6 h-6 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Delete Post ?
                </h2>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    Are you sure you want to delete this post? This action
                    cannot be undone.
                </p>

                <div className="mt-6 flex justify-center space-x-3">
                    <button
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDeleteModal;
