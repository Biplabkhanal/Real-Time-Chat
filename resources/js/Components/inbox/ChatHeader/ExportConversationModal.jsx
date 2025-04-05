import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ExportConversationModal = ({ onClose, userId }) => {
    const [format, setFormat] = useState("pdf");
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const response = await axios.get(
                `/export-conversation/${userId}?format=${format}`,
                {
                    responseType: "blob",
                }
            );

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `conversation-with-${userId}.${format}`
            );
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(
                `Conversation exported as ${format.toUpperCase()} successfully`
            );
            onClose();
        } catch (error) {
            console.error(`Error exporting conversation as ${format}:`, error);
            toast.error(`Failed to export conversation as ${format}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <svg
                            className="w-6 h-6 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white">
                    Export Conversation
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    Choose a format to download your conversation history
                </p>

                <div className="mt-4 flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            name="exportFormat"
                            value="pdf"
                            checked={format === "pdf"}
                            onChange={() => setFormat("pdf")}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                            PDF Document
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            name="exportFormat"
                            value="csv"
                            checked={format === "csv"}
                            onChange={() => setFormat("csv")}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                            CSV Spreadsheet
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex justify-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? "Exporting..." : "Export"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportConversationModal;
