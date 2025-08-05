import React from "react";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import MediaGrid from "./MediaGrid";
import DocumentsList from "./DocumentsList";
import LinksList from "./LinksList";

const SharedMediaRenderer = ({
    activeTab,
    mediaLoading,
    mediaError,
    filterByType,
    refetchMedia,
}) => {
    if (mediaLoading) {
        return <LoadingSpinner size="md" />;
    }

    if (mediaError) {
        return <ErrorDisplay error={mediaError} retryAction={refetchMedia} />;
    }

    if (typeof filterByType !== "function") {
        return (
            <div className="text-center py-4 text-gray-500">
                Error loading media
            </div>
        );
    }

    const filteredFiles = filterByType(activeTab);

    switch (activeTab) {
        case "images":
            return <MediaGrid files={filteredFiles} />;
        case "documents":
            return <DocumentsList files={filteredFiles} />;
        case "links":
            return <LinksList files={filteredFiles} />;
        default:
            return null;
    }
};

export default SharedMediaRenderer;
