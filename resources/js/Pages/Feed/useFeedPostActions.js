import { useState } from "react";
import axios from "axios";

export function useFeedPostActions() {
    const [loading, setLoading] = useState(false);

    const editPost = async (postId, data) => {
        setLoading(true);
        try {
            let config = {};
            let url = `/feed/${postId}`;
            if (data instanceof FormData) {
                data.append("_method", "PUT");
                const res = await axios.post(url, data, config);
                setLoading(false);
                return res.data;
            } else {
                const res = await axios.put(url, data, config);
                setLoading(false);
                return res.data;
            }
        } catch (err) {
            setLoading(false);
            throw err;
        }
    };

    const deletePost = async (postId) => {
        setLoading(true);
        try {
            await axios.delete(`/feed/${postId}`);
            setLoading(false);
            return true;
        } catch (err) {
            setLoading(false);
            throw err;
        }
    };

    return { editPost, deletePost, loading };
}
