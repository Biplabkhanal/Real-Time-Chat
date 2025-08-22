import { UserAvatar } from "../../Components/FriendRequests";
import { useEffect, useRef, useState } from "react";
import { useFeedPostActions } from "./Hooks/useFeedPostActions";
import { useLikePost } from "./Hooks/useLikePost";
import {
    VerticalDotsIcon,
    CancelIcon,
    CheckIcon,
    ShareIcon,
    LikeIcon,
    ChatIcon,
} from "./FeedIcon";
import SharePostModal from "./SharePostModal";
import CommentModal from "./CommentModal";

export default function FeedPost({ post, onEdit, onDelete, user, csrf_token }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const { deletePost, loading } = useFeedPostActions();
    const menuRef = useRef(null);

    const { likeCount, hasLiked, fetchLikeStatus, toggleLike } = useLikePost();

    useEffect(() => {
        fetchLikeStatus(post.id);
    }, [post.id, fetchLikeStatus]);

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
    const handleLikeToggle = () => {
        toggleLike(post.id, hasLiked);
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
                <>
                    <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
                    <img
                        src={`/storage/${post.image_path}`}
                        alt="Post"
                        className="rounded-lg max-h-96 w-full object-cover mb-2"
                    />
                    <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
                </>
            )}
            <div className="flex justify-start items-center px-3 mb-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                </span>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
            <div className="flex justify-between items-center mt-2 px-0 sm:px-2 gap-1">
                <button
                    className={`flex items-center gap-1 py-2 px-4 rounded-lg shadow-md transition-colors w-32 justify-center
        ${
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
                    onClick={() => setShowCommentModal(true)}
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
            <CommentModal
                open={showCommentModal}
                onClose={() => setShowCommentModal(false)}
                post={post}
            />
        </div>
    );
}
