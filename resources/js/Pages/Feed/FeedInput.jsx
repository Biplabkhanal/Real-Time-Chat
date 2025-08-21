import { UserAvatar } from "../../Components/FriendRequests";
import { useState } from "react";

export default function FeedInput({
    content,
    setContent,
    image,
    setImage,
    loading,
    showModal,
    setShowModal,
    handleSubmit,
    user,
    csrf_token,
}) {
    return (
        <div className="flex items-center justify-center">
            <UserAvatar user={user || { name: "User" }} size="ssm" />
            <input
                type="text"
                value={content}
                onClick={() => setShowModal(true)}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.name || "User"}?`}
                className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-base sm:text-lg bg-gray-50 dark:bg-gray-800 cursor-pointer ml-2 sm:ml-4 text-gray-900 dark:text-white"
                readOnly={showModal ? false : true}
            />
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 dark:bg-gray-900 dark:bg-opacity-80 px-2 sm:px-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-md relative">
                        <div className="relative flex items-center justify-center mb-2 h-12">
                            <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white w-full text-center">
                                Create a Post
                            </span>
                            <button
                                className="absolute right-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full focus:outline-none"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <hr className="mb-4 border-gray-300 dark:border-gray-500" />
                        <div className="flex items-center mb-4">
                            <UserAvatar
                                user={user || { name: "User" }}
                                size="sm"
                            />
                            <span className="font-semibold text-gray-800 dark:text-white ml-2 sm:ml-3 text-base sm:text-lg">
                                {user?.name || "User"}
                            </span>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`What's on your mind, ${
                                    user?.name || "User"
                                }?`}
                                className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[60px] sm:min-h-[80px] text-base sm:text-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <label className="flex items-center cursor-pointer">
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm6 2a3 3 0 110 6 3 3 0 010-6z" />
                                </svg>
                                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                                    Photo
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
                                    className="hidden"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow transition duration-200 text-base sm:text-lg"
                                disabled={loading}
                            >
                                {loading ? "Posting..." : "Post"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
