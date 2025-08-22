import { useState } from "react";
import axios from "axios";

export function useCommentApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const addComment = async (postId, content) => {
        setLoading(true);
        setError("");
        try {
            await axios.post("/comment", { post_id: postId, content });
        } catch (err) {
            setError("Failed to add comment.");
        } finally {
            setLoading(false);
        }
    };

    const editComment = async (commentId, content) => {
        setLoading(true);
        setError("");
        try {
            await axios.put(`/comment/${commentId}`, { content });
        } catch (err) {
            setError("Failed to edit comment.");
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (commentId) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`/comment/${commentId}`);
        } catch (err) {
            setError("Failed to delete comment.");
        } finally {
            setLoading(false);
        }
    };

    return {
        addComment,
        editComment,
        deleteComment,
        loading,
        error,
        setError,
    };
}
