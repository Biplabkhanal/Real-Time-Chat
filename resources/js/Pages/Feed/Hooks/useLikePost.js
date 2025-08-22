import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useLikePost() {
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchLikeStatus = async (postId) => {
        try {
            const res = await axios.get(`/post/${postId}/like-status`);
            setLikeCount(res.data.count);
            setHasLiked(res.data.liked);
        } catch (error) {
            toast.error("Failed to fetch like status");
        }
    };

    const toggleLike = async (postId, liked) => {
        setLoading(true);
        try {
            const url = liked
                ? `/post/${postId}/unlike`
                : `/post/${postId}/like`;
            const res = await axios.post(url);
            setLikeCount(res.data.count);
            setHasLiked(res.data.liked);
        } catch (error) {
            toast.error("Failed to update like");
        } finally {
            setLoading(false);
        }
    };

    return {
        likeCount,
        hasLiked,
        loading,
        fetchLikeStatus,
        toggleLike,
        setLikeCount,
        setHasLiked,
    };
}
