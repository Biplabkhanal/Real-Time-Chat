import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import ReviewForm from "./ReviewForm";
import ReviewDeleteModal from "./ReviewDeleteModal";
import TrashIcon from "../Icons/TrashIcon";

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center justify-center space-x-1">
            {[...Array(fullStars)].map((_, i) => (
                <svg
                    key={`full-${i}`}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            {hasHalfStar && (
                <div className="relative w-5 h-5">
                    <svg
                        className="absolute w-5 h-5 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="absolute w-[50%] h-full overflow-hidden">
                        <svg
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg
                    key={`empty-${i}`}
                    className="w-5 h-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">
                {rating.toFixed(1)}
            </span>
        </div>
    );
};

export default function ReviewSection({ reviews, auth }) {
    const hasReviews = reviews?.data && reviews.data.length > 0;
    const averageRating = hasReviews ? reviews.data[0].average_rating : 0;
    const totalReviews = hasReviews ? reviews.data[0].total_reviews : 0;

    return (
        <div className="mt-24 bg-gray-50 dark:bg-gray-900 py-14 px-4 sm:px-6 lg:px-8 rounded-2xl">
            <div className="max-w-4xl mx-auto">
                {hasReviews ? (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            What Our Users Say
                        </h2>
                        <div className="mt-4">
                            <StarRating rating={averageRating} />
                        </div>
                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                            Based on {totalReviews} reviews
                        </p>
                    </div>
                ) : (
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            No Reviews Yet
                        </h2>
                        <p className="mt-3 text-base sm:text-xl text-gray-500 dark:text-gray-400">
                            Be the first to share your experience with ChatSync!
                        </p>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-3">
                    {hasReviews &&
                        reviews.data.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                auth={auth}
                            />
                        ))}
                </div>

                <PaginationLinks reviews={reviews} />

                <div
                    className={`${
                        hasReviews ? "mt-12" : ""
                    } p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Share Your Experience
                    </h3>
                    <ReviewForm auth={auth} />
                </div>
            </div>
        </div>
    );
}

function ReviewCard({ review, auth }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route("reviews.destroy", review.id), {
            preserveScroll: true,
            only: ["reviews"],
            onSuccess: () => {
                toast.success("Review deleted successfully!");
            },
            onError: () => {
                toast.error("Failed to delete review");
            },
        });
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col h-64 relative">
            <>
                {showDeleteModal && (
                    <ReviewDeleteModal
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        reviewId={review.id}
                    />
                )}
                {auth?.user?.id === review.user.id && (
                    <button
                        onClick={handleDelete}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                        title="Delete review"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </>
            <div className="flex items-center mb-3">
                <div className="h-12 w-12 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center text-white font-semibold text-xl">
                    <div className="flex-shrink-0">
                        {review.user.avatar ? (
                            <img
                                src={`/storage/${review.user.avatar}`}
                                alt={review.user.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center text-white font-semibold text-xl border-2 border-gray-200 dark:border-gray-700">
                                {review.user.name
                                    ?.split(" ")[0]
                                    ?.charAt(0)
                                    ?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {review.user.name}
                    </h3>
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">
                                {i < review.rating ? "★" : "☆"}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
                <p className="text-gray-600 dark:text-gray-300">
                    {review.content}
                </p>
            </div>
            <div className="mt-1 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
            </div>
        </div>
    );
}

function PaginationLinks({ reviews }) {
    if (!reviews?.links || reviews.links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-8 flex justify-center">
            <nav
                className="inline-flex rounded-md shadow-sm -space-x-px flex-wrap sm:flex-nowrap max-w-full overflow-x-auto"
                aria-label="Pagination"
            >
                {reviews.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || "#"}
                        className={`relative inline-flex items-center px-3 py-2 sm:px-4 border text-xs sm:text-sm font-medium
                            ${link.url ? "" : "opacity-50 cursor-not-allowed"}
                            ${
                                link.active
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            }
                            ${index === 0 ? "rounded-l-md" : ""}
                            ${
                                index === reviews.links.length - 1
                                    ? "rounded-r-md"
                                    : ""
                            }
                        `}
                        preserveScroll
                        only={["reviews"]}
                        disabled={!link.url}
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    </Link>
                ))}
            </nav>
        </div>
    );
}
