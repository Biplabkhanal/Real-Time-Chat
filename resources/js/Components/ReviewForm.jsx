import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function ReviewForm() {
    const { data, setData, post, processing, reset } = useForm({
        rating: 0,
        content: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("reviews.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
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
    );
}
