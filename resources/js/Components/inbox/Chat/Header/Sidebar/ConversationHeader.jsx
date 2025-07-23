import React from "react";
import { CloseIcon } from "./icons/Icons";

const ConversationHeader = ({ onClose }) => (
    <div className="py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
            Conversation Info
        </h3>
        <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
            <CloseIcon />
        </button>
    </div>
);

export default ConversationHeader;
