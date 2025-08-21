import { UserAvatar } from "../../Components/FriendRequests";
import { useState } from "react";
import { useFeedPostActions } from "./useFeedPostActions";

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

export default function FeedPost({ post, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { deletePost, loading } = useFeedPostActions();

    const handleDelete = () => {
        if (onDelete) onDelete(post.id);
    };
    const handleEdit = () => {
        if (onEdit) onEdit(post);
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
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
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
