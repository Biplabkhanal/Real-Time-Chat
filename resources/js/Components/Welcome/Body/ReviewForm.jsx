import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import ValidationErrorModal from "./ValidationErrorModal";

export default function ReviewForm({ auth }) {
    const { data, setData, post, processing, reset } = useForm({
        rating: 0,
        content: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationError, setValidationError] = useState({
        show: false,
        title: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!auth.user) {
            setIsModalOpen(true);
            return;
        }

        if (data.rating === 0) {
            setValidationError({
                show: true,
                title: "Rating Required",
                message:
                    "Please select a star rating before submitting your review.",
            });
            return;
        }

        if (!data.content.trim()) {
            setValidationError({
                show: true,
                title: "Review Required",
                message: "Please write a review before submitting.",
            });
            return;
        }

        post(route("reviews.store"), {
            onSuccess: () => reset(),
            preserveScroll: true,
            only: ["reviews"],
        });
    };

    const redirectToLogin = () => {
        router.visit(route("login"));
    };

    const closeValidationError = () => {
        setValidationError({ show: false, title: "", message: "" });
    };

    useEffect(() => {
        if (isModalOpen || validationError.show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, validationError.show]);

    const handleModalBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setData("rating", star)}
                                className={`text-2xl ${
                                    star <= data.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <textarea
                        value={data.content}
                        onChange={(e) => setData("content", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 text-sm text-gray-900 dark:text-gray-100"
                        placeholder="Share your experience..."
                        rows="4"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                >
                    Submit Review
                </button>
            </form>

            {/* Login Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                    onClick={handleModalBackdropClick}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Authentication Required
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Please log in to submit your review.
                            </p>

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={redirectToLogin}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-800 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-gray-300 dark:focus:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Error Modal */}
            {validationError.show && (
                <ValidationErrorModal
                    onClose={closeValidationError}
                    title={validationError.title}
                    message={validationError.message}
                />
            )}
        </>
    );
}
