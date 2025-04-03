import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import UserStatus from "./UserStatus";
import SharedMediaModal from "./Messages/SharedMediaModal";
import { usePage } from "@inertiajs/react";

const ChatHeader = ({ selectedUser, onlineUsers, lastSeen }) => {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const { auth } = usePage().props;

    return (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center">
                <div
                    className="cursor-pointer"
                    onClick={() => setShowMediaModal(true)}
                >
                    <UserAvatar
                        name={selectedUser.name}
                        isOnline={onlineUsers[selectedUser.id]}
                        avatar={selectedUser.avatar}
                    />
                </div>
                <div className="ml-4 flex-1">
                    <div className="font-bold text-gray-900 dark:text-white">
                        {selectedUser.name}
                    </div>
                    <UserStatus
                        isOnline={onlineUsers[selectedUser.id]}
                        lastSeen={lastSeen}
                        userId={selectedUser.id}
                    />
                </div>
                <SharedMediaModal
                    isOpen={showMediaModal}
                    onClose={() => setShowMediaModal(false)}
                    currentUserId={auth.user.id}
                    otherUserId={selectedUser.id}
                />
            </div>
        </div>
    );
};

export default ChatHeader;
