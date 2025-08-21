import { useState, useEffect } from "react";
import axios from "axios";
import { UserAvatar } from "./FriendRequests";

export default function FeedTab({ csrf_token, user }) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center">
                <UserAvatar user={user || { name: "User" }} size="md" />
                <input
                    type="text"
                    value={content}
                    onClick={() => setShowModal(true)}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`What's on your mind, ${
                        user?.name || "User"
                    }?`}
                    className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-gray-50 cursor-pointer ml-4"
                    readOnly={showModal ? false : true}
                />
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-lg px-6 pb-6 max-w-md w-full relative">
                        <div className="relative my-5">
                            <span className="block text-xl font-bold text-gray-800 text-center">
                                Create a Post
                            </span>
                            <button
                                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 py-1 rounded-full focus:outline-none"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <hr className="mb-4" />
                        <div className="flex items-center mb-4">
                            <UserAvatar
                                user={user || { name: "User" }}
                                size="sm"
                            />
                            <span className="font-semibold text-gray-800 ml-3">
                                {user?.name || "User"}
                            </span>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`What's on your mind, ${
                                    user?.name || "User"
                                }?`}
                                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[80px] text-lg bg-gray-50"
                            />
                            <label className="flex items-center cursor-pointer">
                                <svg
                                    className="w-6 h-6 text-blue-500 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm6 2a3 3 0 110 6 3 3 0 010-6z" />
                                </svg>
                                <span className="text-sm text-gray-600 font-medium">
                                    Photo
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
                                    className="hidden"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200"
                                disabled={loading}
                            >
                                {loading ? "Posting..." : "Post"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
