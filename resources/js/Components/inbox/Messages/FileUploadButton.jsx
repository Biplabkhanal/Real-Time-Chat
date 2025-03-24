import AttachmentIcon from "../icons/AttachmentIcon";
import { useFileUpload } from "./useFileUpload";

const FileUploadButton = ({ onFileSelect, existingAttachments }) => {
    const { handleFileUpload } = useFileUpload(onFileSelect);

    return (
        <>
            <input
                type="file"
                id="fileInput"
                className="hidden"
                multiple
                onChange={handleFileUpload}
            />
            <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => document.getElementById("fileInput").click()}
            >
                <AttachmentIcon />
            </button>
        </>
    );
};

export default FileUploadButton;
