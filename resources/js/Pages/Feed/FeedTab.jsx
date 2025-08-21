import { useState, useEffect } from "react";
import axios from "axios";
import FeedInput from "./FeedInput";
import FeedPost from "./FeedPost";
import { useFeedPostActions } from "./useFeedPostActions";

export default function FeedTab({ csrf_token, user }) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editPostId, setEditPostId] = useState(null);

    const {
        editPost,
        deletePost,
        loading: postActionLoading,
    } = useFeedPostActions();

    const fetchPosts = async () => {
        const res = await axios.get("/feed");
        setPosts(res.data.posts || []);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleEditPost = (post) => {
        setContent(post.content);
        setImage(post.image_path ? `/storage/${post.image_path}` : null);
        setEditMode(true);
        setEditPostId(post.id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("content", content);
        if (image instanceof File) formData.append("image", image);
        formData.append("_token", csrf_token);
        if (editMode && editPostId) {
            await editPost(editPostId, formData);
            await fetchPosts();
        } else {
            await axios.post("/feed", formData);
            await fetchPosts();
        }
        setContent("");
        setImage(null);
        setLoading(false);
        setShowModal(false);
        setEditMode(false);
        setEditPostId(null);
    };
    const handleDeletePost = async (postId) => {
        await deletePost(postId);
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
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
                    editMode={editMode}
                />
            </div>
            <div className="mt-6 space-y-6">
                {posts.map((post) => (
                    <FeedPost
                        key={post.id}
                        post={post}
                        onDelete={handleDeletePost}
                        onEdit={handleEditPost}
                    />
                ))}
            </div>
        </>
    );
}
