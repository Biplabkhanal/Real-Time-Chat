import React from "react";

const UserStatus = ({ isOnline, lastSeen, userId, isMobile }) => (
    <div className="text-xs">
        {isOnline ? (
            isMobile ? (
                <div className="text-green-500">Online</div>
            ) : (
                <span className="text-green-500">Online</span>
            )
        ) : (
            <div>
                <div className="text-gray-500">Offline</div>
                {lastSeen[userId] && (
                    <>
                        {isMobile ? (
                            <div className="text-gray-400">
                                Last seen:{" "}
                                {new Date(lastSeen[userId]).toLocaleString()}
                            </div>
                        ) : (
                            <>
                                <span className="text-gray-400">
                                    Last seen:{" "}
                                    {new Date(
                                        lastSeen[userId]
                                    ).toLocaleString()}
                                </span>
                            </>
                        )}
                    </>
                )}
            </div>
        )}
    </div>
);

export default UserStatus;
