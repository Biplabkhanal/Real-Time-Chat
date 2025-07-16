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
                accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
                onChange={handleFileUpload}
            />
            <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                onClick={() => document.getElementById("fileInput").click()}
                title="Upload files (Max 2MB each)"
            >
                <AttachmentIcon />
            </button>
        </>
    );
};

export default FileUploadButton;
