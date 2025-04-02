import React from "react";

export default function AppDemo() {
    return (
        <div className="mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Experience ChatSync in Action
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    Modern interface designed for productivity and ease of use
                </p>
            </div>

            <div className="relative mx-auto max-w-5xl rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
                    <div className="flex items-center space-x-1.5 px-3 py-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 h-96 w-full overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="flex h-full w-full">
                                <ChatSidebar />
                                <ChatArea />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChatSidebar() {
    return (
        <div className="w-1/4 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white">
                    Chats
                </h3>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className={`flex items-center p-3 mb-2 rounded-lg ${
                        item === 1 ? "bg-blue-50 dark:bg-blue-900/30" : ""
                    }`}
                >
                    <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                User {item}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                12:34 PM
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Latest message preview...
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ChatArea() {
    return (
        <div className="w-3/4 flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                        User 1
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Online
                    </p>
                </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-xs">
                        <p className="text-sm">
                            Hey there! How are you doing today?
                        </p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 px-4 max-w-xs">
                        <p className="text-sm">
                            I'm doing great! Just checking out this new chat
                            app.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-xs">
                        <p className="text-sm">
                            It's pretty awesome, right? Super fast and easy to
                            use!
                        </p>
                    </div>
                </div>
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="bg-transparent flex-1 focus:outline-none text-gray-700 dark:text-gray-300"
                        readOnly
                    />
                    <button className="ml-2 text-blue-600 dark:text-blue-400">
                        <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
