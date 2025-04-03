import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import TabNavigation from "../ChatHeader/TabNavigation ";
import LoadingSpinner from "../ChatHeader/icons/LoadingSpinner";
import ErrorDisplay from "../ChatHeader/ErrorDisplay";
import MediaGrid from "../ChatHeader/MediaGrid";
import DocumentsList from "../ChatHeader/DocumentsList";
import LinksList from "../ChatHeader/LinksList";

const SharedMediaModal = ({ isOpen, onClose, currentUserId, otherUserId }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("images");

    useEffect(() => {
        if (isOpen && currentUserId && otherUserId) {
            fetchSharedMedia();
        }
    }, [isOpen, currentUserId, otherUserId]);

    const fetchSharedMedia = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                route("messages.media", {
                    userId: otherUserId,
                })
            );
            setMediaFiles(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shared media:", error);
            setError(
                error.response?.data?.message || "Failed to load shared media"
            );
            setLoading(false);
        }
    };

    const filterByType = (type) => {
        if (!mediaFiles || mediaFiles.length === 0) {
            return [];
        }

        if (type === "images") {
            const images = mediaFiles.filter((file) => {
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

            return images;
        } else if (type === "documents") {
            // Similar approach for documents
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

    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }

        if (error) {
            return (
                <ErrorDisplay error={error} retryAction={fetchSharedMedia} />
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

        return null;
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-[36rem]  transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                                >
                                    Shared Media
                                </Dialog.Title>

                                {/* Tabs */}
                                <TabNavigation
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    tabs={[
                                        { id: "images", label: "Images" },
                                        { id: "documents", label: "Documents" },
                                        { id: "links", label: "Links" },
                                    ]}
                                />

                                {/* Content */}
                                <div className="h-[45vh] overflow-y-auto">
                                    {renderContent()}
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default SharedMediaModal;
