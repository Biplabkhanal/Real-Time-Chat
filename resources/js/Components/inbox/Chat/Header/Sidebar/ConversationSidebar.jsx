import React, { useState, useEffect, useRef } from "react";
import TabNavigation from "../TabNavigation ";
import ExportConversationModal from "../../../Modals/ExportConversationModal";
import ConversationAnalytics from "./ConversationAnalytics/ConversationAnalytics";
import ThemeSettings from "../ThemeSettings";
import ConversationUsers from "./ConversationInfo/ConversationUsers";
import ConversationStats from "./ConversationInfo/ConversationStats";
import ConversationTimeline from "./ConversationInfo/ConversationTimeline";
import ConversationContact from "./ConversationInfo/ConversationContact";
import ConversationHeader from "./ConversationHeader";
import SharedMediaRenderer from "../SharedMediaRenderer";
import { fetchConversationStats } from "./sidebarApi";
import { useSharedMedia } from "../../../hooks/useSharedMedia";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ErrorDisplay from "../ErrorDisplay";

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
    const [themeLoading, setThemeLoading] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const exportModalRef = useRef(null);

    // Use shared media hook
    const { mediaFiles, mediaLoading, mediaError, filterByType, refetchMedia } =
        useSharedMedia(
            selectedUser?.id,
            ["images", "documents", "links"].includes(activeTab)
        );

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
            setLoading(true);
            if (activeTab === "info") {
                handleFetchConversationStats();
            }
        }
    }, [isOpen, selectedUser?.id, activeTab]);

    const handleFetchConversationStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchConversationStats(selectedUser.id);
            setStats(result.data);
            if (result.error) setError(result.error);
        } catch (err) {
            setError("Failed to fetch conversation stats.");
        } finally {
            setLoading(false);
        }
    };

    const renderMediaContent = () => {
        if (activeTab === "analytics") {
            return <ConversationAnalytics userId={selectedUser.id} />;
        }

        if (activeTab === "theme") {
            return <ThemeSettings />;
        }

        if (["images", "documents", "links"].includes(activeTab)) {
            return (
                <SharedMediaRenderer
                    activeTab={activeTab}
                    mediaLoading={mediaLoading}
                    mediaError={mediaError}
                    filterByType={filterByType}
                    refetchMedia={refetchMedia}
                />
            );
        }

        return null;
    };

    const handleTabChange = (tab) => {
        if (tab === "theme") {
            setThemeLoading(true);
            setActiveTab(tab);
            setTimeout(() => setThemeLoading(false), 400);
        } else {
            setActiveTab(tab);
        }
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
                    setActiveTab={handleTabChange}
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
                            <LoadingSpinner size="md" />
                        ) : error ? (
                            <ErrorDisplay
                                error={error}
                                retryAction={handleFetchConversationStats}
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
                    <div className="h-full">
                        {themeLoading && activeTab === "theme" ? (
                            <LoadingSpinner size="md" text="Loading..." />
                        ) : (
                            renderMediaContent()
                        )}
                    </div>
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
