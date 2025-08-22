import React, { useEffect, useState } from "react";
import PostHeaderMenu from "./PostHeaderMenu";
import PostContentActions from "./PostContentActions";
import { CancelIcon, CommentIcon } from "./FeedIcon";
import { useLikePost } from "./Hooks/useLikePost";
import SharePostModal from "./SharePostModal";
import { UserAvatar } from "@/Components/FriendRequests";
import axios from "axios";

export default function CommentModal({
    open,
    onClose,
    onEdit,
    onDelete,
    post,
    user,
}) {
    const [showShareModal, setShowShareModal] = useState(false);
    const { likeCount, hasLiked, fetchLikeStatus, toggleLike } = useLikePost();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchLikeStatus(post.id);
    }, [post.id, fetchLikeStatus]);

    const fetchComments = () => {
        axios
            .get(`/post/${post.id}/comments`)
            .then((res) => {
                setComments(res.data);
            })
            .catch(() => {
                setComments([]);
            });
    };

    useEffect(() => {
        if (open) {
            fetchComments();
        }
    }, [open, post.id]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleLikeToggle = () => {
        toggleLike(post.id, hasLiked);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(post.id);
    };
    const handleEdit = () => {
        if (onEdit) onEdit({ ...post, image_path: post.image_path });
        if (onClose) onClose();
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post("/comment", {
                post_id: post.id,
                content: comment,
            });
            setComment("");
            fetchComments();
        } catch (err) {
            setError("Failed to post comment.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ">
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-4 relative flex flex-col w-full max-w-2xl mx-2 sm:mx-auto h-[90vh]"
                style={{
                    height: "90vh",
                    maxHeight: "90vh",
                    overflow: "hidden",
                }}
            >
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
                <PostHeaderMenu
                    post={post}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <PostContentActions
                    post={post}
                    likeCount={likeCount}
                    hasLiked={hasLiked}
                    handleLikeToggle={handleLikeToggle}
                    onComment={() => {}}
                    onShare={() => setShowShareModal(true)}
                    disableComment={true}
                />
                {showShareModal && (
                    <SharePostModal
                        post={post}
                        onClose={() => setShowShareModal(false)}
                        onShare={() => setShowShareModal(false)}
                    />
                )}
                <hr className="my-2 border-gray-300 dark:border-gray-700 block w-full h-[2px]" />
                <div
                    className="flex-1 flex flex-col gap-4 overflow-y-auto"
                    style={{ marginTop: "inherit", marginBottom: "inherit" }}
                >
                    {comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <CommentIcon />
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                No comments yet
                            </span>
                            <span className="text-sm text-gray-500">
                                Be the first to comment.
                            </span>
                        </div>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="flex items-center gap-2">
                                <UserAvatar user={c.user} size="sm" />
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2 flex flex-col">
                                    <span className="font-semibold text-gray-800 dark:text-white text-sm">
                                        {c.user?.name}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                        {c.content}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-auto">
                    <form
                        className="border-gray-200 dark:border-gray-700 p-0 flex items-center gap-2"
                        onSubmit={handleCommentSubmit}
                    >
                        <UserAvatar user={user} size="sm" />
                        <textarea
                            className="flex-1 border rounded-lg p-2 dark:bg-gray-700 dark:text-white resize-none"
                            rows={1}
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            disabled={loading || !comment.trim()}
                        >
                            {loading ? "Posting..." : "Post"}
                        </button>
                        {error && (
                            <span className="text-red-500 text-sm ml-2">
                                {error}
                            </span>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
