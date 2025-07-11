import React, { useState, useEffect } from "react";
import ChatIcon from "../Icons/ChatIcon";

const EmptyChatState = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return (
        <div className="h-full flex justify-center items-center flex-col space-y-4 p-6">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <ChatIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {isMobile ? "Welcome to ChatSync" : "Start a conversation"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
                {isMobile
                    ? "Tap the menu button to see your contacts and start chatting"
                    : "Select a contact from the list to start chatting"}
            </p>
        </div>
    );
};

export default EmptyChatState;
