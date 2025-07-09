import React from "react";

const DocumentsList = ({ files }) => {
    if (files.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No documents shared
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {files.map((file) => {
                let docPath = "";
                try {
                    if (
                        file.path &&
                        typeof file.path === "string" &&
                        file.path.startsWith("{")
                    ) {
                        const parsedPath = JSON.parse(file.path);
                        docPath =
                            parsedPath.url || `/storage/${parsedPath.path}`;
                    } else {
                        docPath = `/storage/${file.path}`;
                    }
                } catch (e) {
                    console.error("Error parsing document path:", e, file);
                    docPath = `/storage/${file.path}`;
                }

                return (
                    <div
                        key={file.id}
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => window.open(docPath, "_blank")}
                    >
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded mr-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-indigo-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.name || "Document"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(file.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DocumentsList;
