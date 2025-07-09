import React from "react";

const MediaGrid = ({ files }) => {
    if (files.length === 0) {
        return (
            <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                No images shared
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {files.map((file) => {
                let imgSrc = "";
                try {
                    if (
                        file.path &&
                        typeof file.path === "string" &&
                        file.path.startsWith("{")
                    ) {
                        const parsedPath = JSON.parse(file.path);
                        imgSrc =
                            parsedPath.url || `/storage/${parsedPath.path}`;
                    } else {
                        imgSrc = `/storage/${file.path}`;
                    }
                } catch (e) {
                    console.error("Error parsing image path:", e, file);
                    imgSrc = `/storage/${file.path}`;
                }

                return (
                    <div
                        key={file.id}
                        className="relative overflow-hidden rounded-lg"
                    >
                        <img
                            src={imgSrc}
                            alt="Shared media"
                            className="h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) => {
                                console.error(
                                    `Failed to load image: ${imgSrc}`
                                );
                                e.target.src = "/path/to/fallback-image.jpg";
                            }}
                            onClick={() => window.open(imgSrc, "_blank")}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default MediaGrid;
