import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import TabNavigation from "./TabNavigation ";
import LoadingSpinner from "../../Shared/Icons/LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import MediaGrid from "./MediaGrid";
import DocumentsList from "./DocumentsList";
import LinksList from "./LinksList";
import ExportConversationModal from "../../Modals/ExportConversationModal";
import ConversationAnalytics from "./ConversationAnalytics";
import ThemeSettings from "./ThemeSettings";

const ConversationSidebar = ({
    isOpen,
    onClose,
    selectedUser,
    currentUser,
}) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    // Media-related state
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [mediaError, setMediaError] = useState(null);

    const [showExportModal, setShowExportModal] = useState(false);
    const exportModalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                exportModalRef.current &&
                !exportModalRef.current.contains(event.target)
            ) {
                setShowExportModal(false);
            }
        }

        if (showExportModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showExportModal]);

    useEffect(() => {
        if (isOpen && selectedUser?.id) {
            if (activeTab === "info") {
                fetchConversationStats();
            } else if (["images", "documents", "links"].includes(activeTab)) {
                fetchSharedMedia();
            }
        }
    }, [isOpen, selectedUser?.id, activeTab]);

    const fetchConversationStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/conversation-stats/${selectedUser.id}`
            );
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching conversation stats:", err);
            setError("Failed to load conversation information");
            setLoading(false);
        }
    };

    const fetchSharedMedia = async () => {
        setMediaLoading(true);
        setMediaError(null);
        try {
            const response = await axios.get(
                route("messages.media", {
                    userId: selectedUser.id,
                })
            );
            setMediaFiles(response.data);
            setMediaLoading(false);
        } catch (error) {
            console.error("Error fetching shared media:", error);
            setMediaError(
                error.response?.data?.message || "Failed to load shared media"
            );
            setMediaLoading(false);
        }
    };

    const filterByType = (type) => {
        if (!mediaFiles || mediaFiles.length === 0) {
            return [];
        }

        if (type === "images") {
            return mediaFiles.filter((file) => {
                try {
                    if (
                        file.path &&
                        typeof file.path === "string" &&
                        file.path.includes('type":"image')
                    ) {
                        const parsedPath = JSON.parse(file.path);
                        return (
                            parsedPath.type &&
                            parsedPath.type.startsWith("image/")
                        );
                    }
                    return file.type && file.type.startsWith("image/");
                } catch (e) {
                    console.error("Error parsing path:", e);
                    return false;
                }
            });
        } else if (type === "documents") {
            return mediaFiles.filter((file) => {
                try {
                    if (
                        file.path &&
                        typeof file.path === "string" &&
                        (file.path.includes("pdf") ||
                            file.path.includes("doc") ||
                            file.path.includes("xlsx") ||
                            file.path.includes("text"))
                    ) {
                        return true;
                    }
                    return (
                        file.type &&
                        (file.type.includes("pdf") ||
                            file.type.includes("doc") ||
                            file.type.includes("xlsx") ||
                            file.type.includes("text"))
                    );
                } catch (e) {
                    return false;
                }
            });
        } else if (type === "links") {
            return mediaFiles.filter((file) => file.is_link);
        }
        return [];
    };

    const renderMediaContent = () => {
        if (mediaLoading) {
            return <LoadingSpinner />;
        }

        if (mediaError) {
            return (
                <ErrorDisplay
                    error={mediaError}
                    retryAction={fetchSharedMedia}
                />
            );
        }

        if (activeTab === "images") {
            return <MediaGrid files={filterByType("images")} />;
        }

        if (activeTab === "documents") {
            return <DocumentsList files={filterByType("documents")} />;
        }

        if (activeTab === "links") {
            return <LinksList files={filterByType("links")} />;
        }

        if (activeTab === "analytics") {
            return <ConversationAnalytics userId={selectedUser.id} />;
        }

        if (activeTab === "theme") {
            return <ThemeSettings />;
        }

        return null;
    };

    return (
        <div
            className={`w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden ${
                isOpen ? "translate-x-0" : "translate-x-full hidden"
            }`}
        >
            {/* Header */}
            <div className="py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
                <h3 className="font-medium text-gray-900 dark:text-white">
                    Conversation Info
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={[
                        { id: "info", label: "Info" },
                        { id: "images", label: "Images" },
                        { id: "documents", label: "Documents" },
                        { id: "links", label: "Links" },
                        { id: "analytics", label: "Analytics" },
                        { id: "theme", label: "Theme" },
                    ]}
                />
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-4">
                {activeTab === "info" && (
                    <div className="space-y-6">
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <ErrorDisplay
                                error={error}
                                retryAction={fetchConversationStats}
                            />
                        ) : stats ? (
                            <>
                                {/* Users involved */}
                                <div className="flex items-center justify-center space-x-6 py-2">
                                    <div className="flex flex-col items-center">
                                        {currentUser.avatar ? (
                                            <img
                                                src={`/storage/${currentUser.avatar}`}
                                                alt={currentUser.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                                                {currentUser.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
                                            You
                                        </p>
                                    </div>

                                    <div className="w-8 h-0 border-t-2 border-gray-300 dark:border-gray-600"></div>

                                    <div className="flex flex-col items-center">
                                        {selectedUser.avatar ? (
                                            <img
                                                src={`/storage/${selectedUser.avatar}`}
                                                alt={selectedUser.name}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                                                {selectedUser.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
                                            {selectedUser.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Conversation stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {stats.total_messages}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Total Messages
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {stats.days_talking}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Days Talking
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Message Distribution
                                    </h4>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                                                        You:{" "}
                                                        {stats.your_messages} (
                                                        {Math.round(
                                                            (stats.your_messages /
                                                                stats.total_messages) *
                                                                100
                                                        )}
                                                        %)
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-400">
                                                        {selectedUser.name}:{" "}
                                                        {stats.their_messages} (
                                                        {Math.round(
                                                            (stats.their_messages /
                                                                stats.total_messages) *
                                                                100
                                                        )}
                                                        %)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                                                <div
                                                    style={{
                                                        width: `${
                                                            (stats.your_messages /
                                                                stats.total_messages) *
                                                            100
                                                        }%`,
                                                    }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                ></div>
                                                <div
                                                    style={{
                                                        width: `${
                                                            (stats.their_messages /
                                                                stats.total_messages) *
                                                            100
                                                        }%`,
                                                    }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Timeline
                                    </h4>
                                    <div className="space-y-4">
                                        {stats.first_message_date && (
                                            <div className="flex">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-blue-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        First message
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {moment(
                                                            stats.first_message_date
                                                        ).format("MMM D, YYYY")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        by{" "}
                                                        {stats.first_message_by ===
                                                        currentUser.id
                                                            ? "You"
                                                            : selectedUser.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {stats.latest_message_date && (
                                            <div className="flex">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-green-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Latest message
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {moment(
                                                            stats.latest_message_date
                                                        ).format("MMM D, YYYY")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        by{" "}
                                                        {stats.latest_message_by ===
                                                        currentUser.id
                                                            ? "You"
                                                            : selectedUser.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {stats.busy_day && (
                                            <div className="flex">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-yellow-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Busiest day
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {moment(
                                                            stats.busy_day.date
                                                        ).format("MMM D, YYYY")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {stats.busy_day.count}{" "}
                                                        messages exchanged
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-6">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                Contact
                                            </h4>
                                            <div className="space-y-2">
                                                <button
                                                    className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    onClick={() =>
                                                        window.open(
                                                            `mailto:${selectedUser.email}`,
                                                            "_blank"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-gray-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                                        Email{" "}
                                                        {selectedUser.name}
                                                    </span>
                                                </button>

                                                {/* Export conversation button */}
                                                <button
                                                    className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    onClick={() =>
                                                        setShowExportModal(true)
                                                    }
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-gray-500"
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
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                                        Export Conversation
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                                No conversation data available
                            </div>
                        )}
                    </div>
                )}

                {(activeTab === "images" ||
                    activeTab === "documents" ||
                    activeTab === "links" ||
                    activeTab === "analytics" ||
                    activeTab === "theme") && (
                    <div className="h-full">{renderMediaContent()}</div>
                )}

                {showExportModal && (
                    <div className="modal-overlay">
                        <div ref={exportModalRef}>
                            <ExportConversationModal
                                userId={selectedUser.id}
                                onClose={() => setShowExportModal(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationSidebar;
