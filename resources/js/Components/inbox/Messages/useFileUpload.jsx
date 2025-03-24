import { toast } from "react-toastify";
import axios from "axios";

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/upload-file", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return {
        url: response.data.url,
        name: file.name,
        type: file.type,
        path: response.data.path,
    };
};

export const useFileUpload = (onFileSelect) => {
    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const loadingToast = toast.loading(
                `Uploading ${files.length} file(s)...`
            );
            try {
                const uploads = await Promise.all(
                    Array.from(files).map((file) => uploadFile(file))
                );
                onFileSelect((prev) => [...prev, ...uploads]);
                toast.success(`${files.length} file(s) attached`);
            } catch (error) {
                console.error("Error uploading files:", error);
                toast.error("Failed to upload files");
            } finally {
                toast.dismiss(loadingToast);
                e.target.value = "";
            }
        }
    };

    return { handleFileUpload };
};
