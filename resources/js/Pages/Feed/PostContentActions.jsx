import React from "react";
import { LikeIcon, ChatIcon, ShareIcon } from "./FeedIcon";

export default function PostContentActions({
    post,
    likeCount,
    hasLiked,
    handleLikeToggle,
    onComment,
    onShare,
    commentCount,
    disableComment,
}) {
    return (
        <>
            <div className="text-gray-900 dark:text-white mb-2 text-base">
                {post.content}
            </div>
            {post.image_path && (
                <>
                    <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
                    <img
                        src={`/storage/${post.image_path}`}
                        alt="Post"
                        className="rounded-lg max-h-96 w-full object-cover mb-2"
                    />
                </>
            )}
            <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
            <div className="flex justify-between items-center px-3 mb-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                </span>
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                    {commentCount ?? 0}{" "}
                    {commentCount === 1 ? "Comment" : "Comments"}
                </span>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
            <div className="flex justify-between items-center mt-2 px-0 sm:px-2 gap-1">
                <button
                    className={`flex items-center gap-1 py-2 px-4 rounded-lg shadow-md transition-colors w-32 justify-center ${
                        hasLiked
                            ? "text-blue-500"
                            : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                    }`}
                    onClick={handleLikeToggle}
                >
                    <LikeIcon className="w-5 h-5" />
                    {hasLiked ? "Unlike" : "Like"}
                </button>
                <button
                    className={`flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors py-2 px-4 rounded-lg shadow-md w-32 justify-center ${
                        disableComment ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={disableComment ? undefined : onComment}
                    disabled={disableComment}
                >
                    <ChatIcon className="w-5 h-5" />
                    Comment
                </button>
                <button
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors py-2 px-4 rounded-lg shadow-md w-32 justify-center"
                    onClick={onShare}
                >
                    <ShareIcon className="w-5 h-5" />
                    Share
                </button>
            </div>
        </>
    );
}
