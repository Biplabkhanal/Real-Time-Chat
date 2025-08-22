import React from "react";
import { UserAvatar } from "../../Components/FriendRequests";
import {
    VerticalDotsIcon,
    CancelIcon,
    CheckIcon,
    ShareIcon,
    LikeIcon,
    ChatIcon,
} from "./FeedIcon";
import { useSharePost } from "./useSharePost";
import SharePostModal from "./SharePostModal";

export default function CommentModal({ open, onClose, post }) {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [showShareModal, setShowShareModal] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(
        post.likeCount || post.likes || 0
    );
    const [hasLiked, setHasLiked] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        if (!menuOpen) return;
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    React.useEffect(() => {
        fetch(`/post/${post.id}/like-status`)
            .then((res) => res.json())
            .then((data) => {
                setLikeCount(data.count);
                setHasLiked(data.liked);
            });
    }, [post.id]);

    const handleLikeToggle = () => {
        const url = hasLiked
            ? `/post/${post.id}/unlike`
            : `/post/${post.id}/like`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            },
            body: JSON.stringify({
                _token:
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLikeCount(data.count);
                setHasLiked(data.liked);
            });
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-4 relative w-full max-w-2xl">
                <div className="flex items-center justify-between w-full mb-2 relative">
                    <span className="font-bold text-gray-900 dark:text-white text-xl mx-auto text-center w-full">
                        {post.user?.name || "User"}'s Post
                    </span>
                    <button
                        className="px-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 absolute right-0"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <CancelIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
                <div className="flex items-center mb-3">
                    <UserAvatar
                        user={post.user || { name: "User" }}
                        size="sm"
                    />
                    <div className="ml-3">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {post.user?.name || "User"}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {post.created_at
                                ? new Date(post.created_at).toLocaleString()
                                : ""}
                        </div>
                    </div>
                    <div className="ml-auto relative">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label="Menu"
                        >
                            <VerticalDotsIcon className="h-6 w-6 text-gray-500" />
                        </button>
                        {menuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                            >
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    onClick={() => {}}
                                    disabled
                                >
                                    <CheckIcon className="w-4 h-4 text-green-500" />{" "}
                                    Edit
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    onClick={() => {}}
                                    disabled
                                >
                                    <CancelIcon className="w-4 h-4 text-red-500" />{" "}
                                    Delete
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    onClick={() => setShowShareModal(true)}
                                >
                                    <ShareIcon className="w-5 h-5 text-gray-500" />{" "}
                                    Share
                                </button>
                            </div>
                        )}
                        {showShareModal && (
                            <SharePostModal
                                post={post}
                                onClose={() => setShowShareModal(false)}
                                onShare={() => setShowShareModal(false)}
                            />
                        )}
                    </div>
                </div>
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
                <div className="flex justify-start items-center px-3 mb-1">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {post.likeCount !== undefined
                            ? post.likeCount
                            : post.likes || 0}{" "}
                        {(post.likeCount !== undefined
                            ? post.likeCount
                            : post.likes || 0) === 1
                            ? "Like"
                            : "Likes"}
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
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors py-2 px-4 rounded-lg shadow-md w-32 justify-center "
                        onClick={() => {}}
                        disabled
                    >
                        <ChatIcon className="w-5 h-5" />
                        Comment
                    </button>
                    <button
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors py-2 px-4 rounded-lg shadow-md w-32 justify-center"
                        onClick={() => setShowShareModal(true)}
                    >
                        <ShareIcon className="w-5 h-5" />
                        Share
                    </button>
                </div>
                <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="flex flex-col items-center">
                        <svg
                            className="w-12 h-12 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="2"
                                fill="#e5e7eb"
                            />
                            <rect
                                x="8"
                                y="8"
                                width="8"
                                height="4"
                                rx="1"
                                fill="#9ca3af"
                            />
                        </svg>
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            No comments yet
                        </span>
                        <span className="text-sm text-gray-500">
                            Be the first to comment.
                        </span>
                    </div>
                </div>
                <form className="border-gray-200 dark:border-gray-700 p-4 flex items-center gap-2">
                    <UserAvatar
                        user={post.user || { name: "User" }}
                        size="sm"
                    />
                    <textarea
                        className="flex-1 border rounded-lg p-2 dark:bg-gray-700 dark:text-white resize-none"
                        rows={1}
                        placeholder="Write a comment..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}
