import { toast } from "react-toastify";
import axios from "axios";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

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
        size: response.data.size || null,
    };
};

const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
        return `File too large! "${file.name}" is ${fileSizeMB}MB but maximum allowed is ${maxSizeMB}MB. Please choose a smaller file.`;
    }
    return null;
};

export const useFileUpload = (onFileSelect) => {
    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const validationErrors = [];
            const validFiles = [];

            Array.from(files).forEach((file) => {
                const sizeError = validateFileSize(file);
                if (sizeError) {
                    validationErrors.push(sizeError);
                } else {
                    validFiles.push(file);
                }
            });

            if (validationErrors.length > 0) {
                validationErrors.forEach((error) => {
                    toast.error(error, {
                        position: "top-right",
                        autoClose: 7000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        style: {
                            fontSize: "14px",
                            fontWeight: "500",
                            zIndex: 9999,
                        },
                        className: "file-size-error-toast",
                        bodyClassName: "file-error-body",
                        progressClassName: "file-error-progress",
                        toastId: `file-size-error-${Date.now()}`,
                    });
                });
            }

            if (validFiles.length > 0) {
                try {
                    const uploads = await Promise.all(
                        validFiles.map((file) => uploadFile(file))
                    );

                    onFileSelect((prev) => [...prev, ...uploads]);
                    toast.success(
                        `${validFiles.length} file(s) attached successfully`
                    );
                } catch (error) {
                    console.error("Error uploading files:", error);

                    if (error.response?.status === 413) {
                        toast.error(
                            error.response.data.error || "File size too large",
                            {
                                position: "top-right",
                                autoClose: 7000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                style: {
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    zIndex: 9999,
                                },
                                className: "file-size-error-toast",
                                toastId: `server-file-size-error-${Date.now()}`,
                            }
                        );
                    } else if (error.response?.status === 422) {
                        const errorMessage =
                            error.response.data.error ||
                            "File validation failed";
                        toast.error(errorMessage, {
                            position: "top-right",
                            autoClose: 7000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            style: {
                                fontSize: "14px",
                                fontWeight: "500",
                                zIndex: 9999,
                            },
                            className: "file-validation-error-toast",
                            toastId: `server-validation-error-${Date.now()}`,
                        });
                    } else {
                        toast.error(
                            "Failed to upload files. Please try again.",
                            {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                style: {
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    zIndex: 9999,
                                },
                                className: "file-upload-error-toast",
                            }
                        );
                    }
                } finally {
                    toast.dismiss(loadingToast);
                    e.target.value = "";
                }
            } else {
                e.target.value = "";
            }
        }
    };

    return { handleFileUpload };
};
