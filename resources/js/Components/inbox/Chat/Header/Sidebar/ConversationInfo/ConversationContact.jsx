import React from "react";
import { EmailIcon, ExportIcon } from "../icons/Icons";

const ConversationContact = ({ selectedUser, setShowExportModal }) => (
    <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Contact
        </h4>
        <div className="space-y-2">
            <button
                className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() =>
                    window.open(`mailto:${selectedUser.email}`, "_blank")
                }
            >
                <EmailIcon />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Email {selectedUser.name}
                </span>
            </button>
            <button
                className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowExportModal(true)}
            >
                <ExportIcon />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Export Conversation
                </span>
            </button>
        </div>
    </div>
);

export default ConversationContact;
