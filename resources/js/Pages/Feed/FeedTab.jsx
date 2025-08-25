import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FeedInput from "./FeedInput";
import FeedPost from "./FeedPost";
import { useFeedPostActions } from "./Hooks/useFeedPostActions";
import { toast } from "react-toastify";

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
        try {
            if (editMode && editPostId) {
                await editPost(editPostId, formData);
                await fetchPosts();
                toast.success("Post updated successfully!");
            } else {
                await axios.post("/feed", formData);
                await fetchPosts();
                toast.success("Post uploaded successfully!");
            }
            setContent("");
            setImage(null);
            setShowModal(false);
            setEditMode(false);
            setEditPostId(null);
        } catch (err) {
            toast.error("Action failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);
            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
            toast.success("Post deleted successfully!");
        } catch (err) {
            toast.error("Failed to delete post.");
        }
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

    const lastPostRef = useRef(null);

    useEffect(() => {
        if (posts.length > 0 && lastPostRef.current) {
            lastPostRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [posts]);

    return (
        <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-hide pb-32">
            <div className="w-full mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
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
                {posts.map((post, idx) => (
                    <FeedPost
                        key={post.id}
                        post={post}
                        onDelete={handleDeletePost}
                        onEdit={handleEditPost}
                        user={user}
                        csrf_token={csrf_token}
                        ref={idx === posts.length - 1 ? lastPostRef : null}
                    />
                ))}
            </div>
        </div>
    );
}
