import { UserAvatar } from "../../Components/FriendRequests";
import { useEffect, useRef, useState } from "react";
import { useFeedPostActions } from "./useFeedPostActions";
import {
    CancelIcon,
    CheckIcon,
    ChatIcon,
    ShareIcon,
} from "../../Components/FriendRequests/icons";
import SharePostModal from "./SharePostModal";

function VerticalDotsIcon({ className }) {
    return (
        <svg
            className={className || "h-6 w-6"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
    );
}

export default function FeedPost({ post, onEdit, onDelete, user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const { deletePost, loading } = useFeedPostActions();
    const menuRef = useRef(null);

    useEffect(() => {
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

    const handleDelete = () => {
        if (onDelete) onDelete(post.id);
    };
    const handleEdit = () => {
        if (onEdit) onEdit({ ...post, image_path: post.image_path });
        setMenuOpen(false);
    };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-4 relative">
            <div className="flex items-center mb-3">
                <UserAvatar user={post.user || { name: "User" }} size="sm" />
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
                            {user && post.user?.id === user.id && (
                                <>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        onClick={handleEdit}
                                    >
                                        <CheckIcon className="w-4 h-4 text-green-500" />{" "}
                                        Edit
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        <CancelIcon className="w-4 h-4 text-red-500" />{" "}
                                        {loading ? "Deleting..." : "Delete"}
                                    </button>
                                </>
                            )}
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
                <img
                    src={`/storage/${post.image_path}`}
                    alt="Post"
                    className="rounded-lg max-h-96 w-full object-cover mb-2"
                />
            )}
        </div>
    );
}
