import React from "react";
import ChatIcon from "./icons/ChatIcon";

const EmptyChatState = () => (
    <div className="h-full flex justify-center items-center flex-col space-y-4 p-6">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <ChatIcon />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Start a conversation
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
            Select a contact from the list to start chatting
        </p>
    </div>
);

export default EmptyChatState;
