import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TabNavigation from "../TabNavigation ";
import LoadingSpinner from "../../../Shared/Icons/LoadingSpinner";
import ErrorDisplay from "../ErrorDisplay";
import MediaGrid from "../MediaGrid";
import DocumentsList from "../DocumentsList";
import LinksList from "../LinksList";
import ExportConversationModal from "../../../Modals/ExportConversationModal";
import ConversationAnalytics from "./ConversationAnalytics/ConversationAnalytics";
import ThemeSettings from "../ThemeSettings";
import ConversationUsers from "./ConversationInfo/ConversationUsers";
import ConversationStats from "./ConversationInfo/ConversationStats";
import ConversationTimeline from "./ConversationInfo/ConversationTimeline";
import ConversationContact from "./ConversationInfo/ConversationContact";
import ConversationHeader from "./ConversationHeader";

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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

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

    if (isMobile) {
        return null;
    }

    return (
        <div
            className={`${
                isMobile
                    ? "fixed inset-y-0 right-0 w-full sm:w-1/2 z-50"
                    : "w-1/4"
            } bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden ${
                isOpen ? "translate-x-0" : "translate-x-full hidden"
            }`}
        >
            <ConversationHeader onClose={onClose} />

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
                                <ConversationUsers
                                    currentUser={currentUser}
                                    selectedUser={selectedUser}
                                />

                                <ConversationStats stats={stats} />

                                <div>
                                    <ConversationTimeline
                                        stats={stats}
                                        currentUser={currentUser}
                                        selectedUser={selectedUser}
                                    />
                                </div>

                                <div className="mt-6">
                                    <div className="space-y-2">
                                        <ConversationContact
                                            selectedUser={selectedUser}
                                            setShowExportModal={
                                                setShowExportModal
                                            }
                                        />
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
