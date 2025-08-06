import React from "react";

const TypingIndicator = ({ user }) => {
    return (
        <div className="flex items-start space-x-3">
            <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 max-w-xs shadow-lg border border-gray-200 dark:border-gray-600 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            {user?.name} is typing
                        </span>
                        <div className="flex space-x-1">
                            <div
                                className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
                                style={{
                                    animationDelay: "0ms",
                                    animationDuration: "1.4s",
                                }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
                                style={{
                                    animationDelay: "160ms",
                                    animationDuration: "1.4s",
                                }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
                                style={{
                                    animationDelay: "320ms",
                                    animationDuration: "1.4s",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
