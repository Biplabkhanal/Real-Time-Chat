import { useState, useEffect } from "react";
import axios from "axios";

export const useSharedMedia = (selectedUserId, isActive = false) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [mediaError, setMediaError] = useState(null);

    useEffect(() => {
        if (isActive && selectedUserId) {
            handleFetchSharedMedia();
        }
    }, [isActive, selectedUserId]);

    const handleFetchSharedMedia = async () => {
        setMediaLoading(true);
        setMediaError(null);
        try {
            const response = await axios.get(
                `/messages/media/${selectedUserId}`
            );

            const data = Array.isArray(response.data) ? response.data : [];

            setMediaFiles(data);
            setMediaError(null);
        } catch (err) {
            console.error("Error fetching shared media:", err);
            setMediaError("Failed to fetch media.");
            setMediaFiles([]);
        } finally {
            setMediaLoading(false);
        }
    };

    const filterByType = (type) => {
        if (
            !mediaFiles ||
            !Array.isArray(mediaFiles) ||
            mediaFiles.length === 0
        ) {
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

    return {
        mediaFiles,
        mediaLoading,
        mediaError,
        filterByType,
        refetchMedia: handleFetchSharedMedia,
    };
};
