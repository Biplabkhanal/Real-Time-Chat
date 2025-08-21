import { useState, useEffect } from "react";
import axios from "axios";

export default function FeedTab({ csrf_token }) {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const res = await axios.get("/feed");
        setPosts(res.data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", content);
        if (image) formData.append("image", image);
        formData.append("_token", csrf_token);
        await axios.post("/feed", formData);
        setContent("");
        setImage(null);
        fetchPosts();
    };

    const normalizedPosts = Array.isArray(posts)
        ? posts
        : posts?.data || Object.values(posts || {});

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mb-2"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Post
                </button>
            </form>
            {loading ? (
                <div>Loading feed...</div>
            ) : (
                <div>
                    {normalizedPosts.map((post) => (
                        <div key={post.id} className="border-b py-4">
                            <div className="font-bold">
                                {post.user?.name || "User"}
                            </div>
                            <div>{post.content}</div>
                            {post.image_path && (
                                <img
                                    src={`/storage/${post.image_path}`}
                                    alt="Post"
                                    className="mt-2 max-w-xs"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
