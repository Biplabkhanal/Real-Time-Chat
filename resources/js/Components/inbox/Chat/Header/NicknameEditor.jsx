import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingIcon } from "@/Components/FriendRequests";

const NicknameEditor = ({ selectedUser, onNicknameSaved }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const [nickname, setNickname] = useState(
        selectedUser.display_name !== selectedUser.name
            ? selectedUser.display_name
            : ""
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setNickname(
            selectedUser.display_name !== selectedUser.name
                ? selectedUser.display_name
                : ""
        );
        setIsEditing(false);
    }, [selectedUser]);

    const handleSaveNickname = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `/nickname/set/${selectedUser.id}`,
                {
                    nickname: nickname.trim() || null,
                }
            );

            setNickname(
                response.data.display_name !== selectedUser.name
                    ? response.data.display_name
                    : ""
            );

            toast.success(response.data.message);
            setIsEditing(false);

            if (onNicknameSaved) {
                onNicknameSaved(response.data.display_name, false);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error || "Failed to update nickname"
            );
            console.error("Error updating nickname:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setNickname(
            selectedUser.display_name !== selectedUser.name
                ? selectedUser.display_name
                : ""
        );
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full">
            {!isEditing ? (
                <div
                    className={`flex ${
                        isMobile ? "flex-col" : "items-center"
                    } justify-between mb-2`}
                >
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Nickname
                        </h4>
                        <div className="mt-1">
                            {nickname ? (
                                <div className="text-sm text-gray-800 dark:text-gray-200">
                                    {nickname}
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Real name: {selectedUser.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    No nickname set
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`text-xs text-blue-600 dark:text-blue-400 hover:underline ${
                            isMobile ? "mt-2 self-start" : ""
                        }`}
                    >
                        {nickname ? "Edit" : "Add"}
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="mb-2">
                        <label
                            htmlFor="nickname"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Nickname for {selectedUser.name}
                        </label>
                        <input
                            id="nickname"
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Enter nickname"
                            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Leave empty to use their real name
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSaveNickname}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700
                                     dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingIcon
                                        size="md"
                                        className="mr-2 text-white"
                                    />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                "Save"
                            )}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200
                                     dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NicknameEditor;
