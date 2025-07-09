import AttachmentIcon from "../../Shared/Icons/AttachmentIcon";
import { useFileUpload } from "../../hooks/useFileUpload";

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
