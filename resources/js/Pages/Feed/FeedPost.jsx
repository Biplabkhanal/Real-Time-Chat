import { useEffect, useState } from "react";
import axios from "axios";
import PostHeaderMenu from "./PostHeaderMenu";
import PostContentActions from "./PostContentActions";
import { useLikePost } from "./Hooks/useLikePost";
import CommentModal from "./CommentModal";
import SharePostModal from "./SharePostModal";

export default function FeedPost({ post, onEdit, onDelete, user }) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const { likeCount, hasLiked, fetchLikeStatus, toggleLike } = useLikePost();
    const [commentCount, setCommentCount] = useState(post.comment_count ?? 0);

    useEffect(() => {
        fetchLikeStatus(post.id);
    }, [post.id, fetchLikeStatus]);

    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const res = await axios.get(`/post/${post.id}/comments`);
                setCommentCount(res.data.length);
            } catch {
                setCommentCount(0);
            }
        };
        fetchCommentCount();
    }, [post.id]);

    const handleDelete = () => {
        if (onDelete) onDelete(post.id);
    };
    const handleEdit = () => {
        if (onEdit) onEdit({ ...post, image_path: post.image_path });
    };
    const handleLikeToggle = () => {
        toggleLike(post.id, hasLiked);
    };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-4 relative">
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
                onComment={() => setShowCommentModal(true)}
                onShare={() => setShowShareModal(true)}
                commentCount={commentCount}
                setCommentCount={setCommentCount}
            />
            <CommentModal
                open={showCommentModal}
                onClose={() => setShowCommentModal(false)}
                post={post}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                commentCount={commentCount}
                setCommentCount={setCommentCount}
            />
            {showShareModal && (
                <SharePostModal
                    post={post}
                    onClose={() => setShowShareModal(false)}
                    onShare={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
}
