import React from "react";
import AttachmentImage from "./AttachmentImage";
import AttachmentFile from "./AttachmentFile";
import RemoveButton from "../icons/RemoveButton";

const AttachmentPreview = ({ attachments, onRemove }) => {
    if (attachments.length === 0) return null;

    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2 mr-[3.6rem]">
            <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-white dark:bg-gray-800 p-2 rounded"
                    >
                        <div className="flex-grow overflow-hidden flex items-center">
                            {attachment.type &&
                            attachment.type.startsWith("image/") ? (
                                <AttachmentImage
                                    url={attachment.url}
                                    name={attachment.name}
                                />
                            ) : (
                                <AttachmentFile name={attachment.name} />
                            )}
                        </div>
                        <RemoveButton onClick={() => onRemove(index)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttachmentPreview;
