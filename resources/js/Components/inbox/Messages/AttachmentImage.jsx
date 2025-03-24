import React from "react";

const AttachmentImage = ({ url, name }) => (
    <div className="flex items-center">
        <img
            src={url}
            alt={name}
            className="h-10 w-10 object-cover rounded mr-2"
        />
        <span className="text-sm truncate max-w-[140px] text-white">
            {name}
        </span>
    </div>
);

export default AttachmentImage;
