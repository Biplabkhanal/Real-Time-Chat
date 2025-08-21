import { useState, useEffect } from "react";
import axios from "axios";
import FeedInput from "./FeedInput";
import FeedPost from "./FeedPost";

export default function FeedTab({ csrf_token, user }) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const res = await axios.get("/feed");
        setPosts(res.data.posts || []);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("content", content);
        if (image) formData.append("image", image);
        formData.append("_token", csrf_token);
        await axios.post("/feed", formData);
        setContent("");
        setImage(null);
        setLoading(false);
        setShowModal(false);
        fetchPosts();
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showModal]);

    return (
        <>
            <div className=" w-full mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <FeedInput
                    content={content}
                    setContent={setContent}
                    image={image}
                    setImage={setImage}
                    loading={loading}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    handleSubmit={handleSubmit}
                    user={user}
                    csrf_token={csrf_token}
                />
            </div>
            <div className="mt-6 space-y-6">
                {posts.map((post) => (
                    <FeedPost key={post.id} post={post} />
                ))}
            </div>
        </>
    );
}
