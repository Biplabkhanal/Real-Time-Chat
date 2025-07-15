import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const NicknameEditor = ({ selectedUser, onNicknameSaved }) => {
    const [nickname, setNickname] = useState(
        selectedUser.display_name !== selectedUser.name
            ? selectedUser.display_name
            : ""
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveNickname = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `/nickname/set/${selectedUser.id}`,
                {
                    nickname: nickname.trim() || null, // Send null if empty to remove nickname
                }
            );

            toast.success(response.data.message);
            setIsEditing(false);

            if (onNicknameSaved) {
                onNicknameSaved(response.data.display_name);
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
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Nickname
                </h4>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {nickname ? "Edit" : "Add"}
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Enter nickname"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isLoading}
                    />
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSaveNickname}
                            disabled={isLoading}
                            className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700
                                     dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                            className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200
                                     dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Leave empty to use their real name
                    </p>
                </div>
            ) : (
                <div>
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
            )}
        </div>
    );
};

export default NicknameEditor;
