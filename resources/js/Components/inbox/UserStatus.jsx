import React from "react";

const UserStatus = ({ isOnline, lastSeen, userId }) => (
    <div className="text-xs">
        {isOnline ? (
            <span className="text-green-500">Online</span>
        ) : (
            <div>
                <span className="text-gray-500">Offline</span>
                <br />
                {lastSeen[userId] && (
                    <span className="text-gray-400">
                        Last seen: {new Date(lastSeen[userId]).toLocaleString()}
                    </span>
                )}
            </div>
        )}
    </div>
);

export default UserStatus;
