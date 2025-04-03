import React from "react";
import { Link } from "@inertiajs/react";
import ReviewForm from "./ReviewForm";

export default function ReviewSection({ reviews, auth }) {
    return (
        <div className="mt-24 bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 rounded-2xl">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        What Our Users Say
                    </h2>
                    <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
                        Read reviews from real ChatSync users
                    </p>
                </div>

                {/* Review Cards */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {reviews?.data &&
                        reviews.data.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                </div>

                {/* Pagination */}
                <PaginationLinks reviews={reviews} />

                {/* Review Form */}
                <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Share Your Experience
                    </h3>
                    <ReviewForm auth={auth} />
                </div>
            </div>
        </div>
    );
}

// Review Card Component
function ReviewCard({ review }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col h-64">
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

// Pagination Component
function PaginationLinks({ reviews }) {
    if (!reviews?.links || reviews.links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-8 flex justify-center">
            <nav
                className="inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
            >
                {reviews.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || "#"}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
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
