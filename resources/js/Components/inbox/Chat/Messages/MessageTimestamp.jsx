import React from "react";

const MessageTimestamp = ({ time, isCurrentUser, formatTime }) => (
    <span className="block text-xs mt-1 opacity-70">
        {formatTime(time)}
        {isCurrentUser && <span className="ml-1">✓✓</span>}
    </span>
);

export default MessageTimestamp;
