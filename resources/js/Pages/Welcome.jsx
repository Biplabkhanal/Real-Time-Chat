import Dropdown from "@/Components/Dropdown";
import ReviewForm from "@/Components/ReviewForm";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome({ auth, reviews, laravelVersion, phpVersion }) {
    const user = usePage().props.auth.user;
    const [reviewData, setReviewData] = useState(reviews || []);
    useEffect(() => {
        if (reviews) {
            setReviewData(reviews);
        }
    }, [reviews]);

    return (
        <>
            <Head title="ChatSync - Real-Time Chat App" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                {/* Chat App Logo */}
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                                    <svg
                                        className="h-8 w-8 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    ChatSync
                                </div>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                        <div className="relative ms-3">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                        >
                                                            {user.name}

                                                            <svg
                                                                className="-me-0.5 ms-2 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <Dropdown.Link
                                                        href={route("inbox")}
                                                    >
                                                        Inbox
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "profile.edit"
                                                        )}
                                                    >
                                                        Profile
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                    >
                                                        Log Out
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-600 dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-600 dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            {/* Hero Section */}
                            <div className="text-center mb-16">
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                    <span className="block">
                                        Connect in real-time with
                                    </span>
                                    <span className="block text-blue-600 dark:text-blue-400">
                                        ChatSync
                                    </span>
                                </h1>
                                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                    Seamless, secure, and fast messaging for
                                    teams and individuals. Chat with anyone,
                                    anywhere, anytime.
                                </p>
                                <div className="mt-8 flex justify-center">
                                    {!auth.user && (
                                        <>
                                            <div className="inline-flex rounded-md shadow">
                                                <Link
                                                    href={route("register")}
                                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Get Started Free
                                                </Link>
                                            </div>
                                            <div className="ml-3 inline-flex rounded-md shadow">
                                                <Link
                                                    href={route("login")}
                                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                                                >
                                                    Log In
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                    {auth.user && (
                                        <div className="inline-flex rounded-md shadow">
                                            <Link
                                                href={route("inbox")}
                                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                Go to Inbox
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                                {/* Feature 1 */}
                                <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-200 transition duration-300 hover:shadow-xl lg:p-8 dark:bg-gray-800 dark:ring-gray-700">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <svg
                                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Real-Time Messaging
                                        </h2>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                                            Send and receive messages instantly
                                            with our lightning-fast messaging
                                            system powered by WebSockets.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-200 transition duration-300 hover:shadow-xl lg:p-8 dark:bg-gray-800 dark:ring-gray-700">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <svg
                                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Group Chats
                                        </h2>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                                            Create group conversations with
                                            friends, family, or colleagues.
                                            Share files and collaborate
                                            efficiently.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-200 transition duration-300 hover:shadow-xl lg:p-8 dark:bg-gray-800 dark:ring-gray-700">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <svg
                                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Secure Communication
                                        </h2>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                                            End-to-end encryption ensures your
                                            conversations remain private and
                                            secure at all times.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* App Screenshot Section */}
                            <div className="mt-20">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Experience ChatSync in Action
                                    </h2>
                                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                                        Modern interface designed for
                                        productivity and ease of use
                                    </p>
                                </div>

                                <div className="relative mx-auto max-w-5xl rounded-lg shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
                                        <div className="flex items-center space-x-1.5 px-3 py-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 h-96 w-full overflow-hidden">
                                            {/* Placeholder for app screenshot */}
                                            <div className="h-full w-full flex items-center justify-center">
                                                <div className="flex h-full w-full">
                                                    {/* Sidebar mockup */}
                                                    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <h3 className="font-bold text-gray-800 dark:text-white">
                                                                Chats
                                                            </h3>
                                                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                                <svg
                                                                    className="h-4 w-4 text-white"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {/* Chat list mockup */}
                                                        {[1, 2, 3, 4].map(
                                                            (item) => (
                                                                <div
                                                                    key={item}
                                                                    className={`flex items-center p-3 mb-2 rounded-lg ${
                                                                        item ===
                                                                        1
                                                                            ? "bg-blue-50 dark:bg-blue-900/30"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between">
                                                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                                User{" "}
                                                                                {
                                                                                    item
                                                                                }
                                                                            </p>
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                12:34
                                                                                PM
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            Latest
                                                                            message
                                                                            preview...
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                    {/* Chat area mockup */}
                                                    <div className="w-3/4 flex flex-col">
                                                        {/* Chat header */}
                                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                    User 1
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Online
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Chat messages */}
                                                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                                            <div className="flex justify-end">
                                                                <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-xs">
                                                                    <p className="text-sm">
                                                                        Hey
                                                                        there!
                                                                        How are
                                                                        you
                                                                        doing
                                                                        today?
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-start">
                                                                <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 px-4 max-w-xs">
                                                                    <p className="text-sm">
                                                                        I'm
                                                                        doing
                                                                        great!
                                                                        Just
                                                                        checking
                                                                        out this
                                                                        new chat
                                                                        app.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end">
                                                                <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-xs">
                                                                    <p className="text-sm">
                                                                        It's
                                                                        pretty
                                                                        awesome,
                                                                        right?
                                                                        Super
                                                                        fast and
                                                                        easy to
                                                                        use!
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Message input */}
                                                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Type a message..."
                                                                    className="bg-transparent flex-1 focus:outline-none text-gray-700 dark:text-gray-300"
                                                                    readOnly
                                                                />
                                                                <button className="ml-2 text-blue-600 dark:text-blue-400">
                                                                    <svg
                                                                        className="h-5 w-5"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonials */}
                            <div className="mt-24 bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 rounded-2xl">
                                <div className="max-w-4xl mx-auto">
                                    <div className="text-center mb-12">
                                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                            What Our Users Say
                                        </h2>
                                        <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
                                            Read reviews from real ChatSync
                                            users
                                        </p>
                                    </div>

                                    <div className="grid gap-8 lg:grid-cols-3">
                                        {reviews?.data &&
                                            reviews.data.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5"
                                                >
                                                    <div className="flex items-center mb-4">
                                                        <div className="h-12 w-12 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center text-white font-semibold text-xl">
                                                            {review.user.name
                                                                ?.split(" ")[0]
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "?"}
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    review.user
                                                                        .name
                                                                }
                                                            </h3>
                                                            <div className="flex text-yellow-400">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="text-lg"
                                                                        >
                                                                            {i <
                                                                            review.rating
                                                                                ? "★"
                                                                                : "☆"}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {review.content}
                                                    </p>
                                                    <div className="mt-4 text-xs text-gray-500">
                                                        {new Date(
                                                            review.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Pagination */}
                                    {reviews?.links &&
                                        reviews.links.length > 3 && (
                                            <div className="mt-8 flex justify-center">
                                                <nav
                                                    className="inline-flex rounded-md shadow-sm -space-x-px"
                                                    aria-label="Pagination"
                                                >
                                                    {reviews.links.map(
                                                        (link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={
                                                                    link.url ||
                                                                    "#"
                                                                }
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
                                                                only={[
                                                                    "reviews",
                                                                ]}
                                                                disabled={
                                                                    !link.url
                                                                }
                                                            >
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            </Link>
                                                        )
                                                    )}
                                                </nav>
                                            </div>
                                        )}

                                    {auth.user && (
                                        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                                Share Your Experience
                                            </h3>
                                            <ReviewForm />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-24 bg-blue-600 dark:bg-blue-700 rounded-xl overflow-hidden">
                                <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 text-center">
                                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                        Ready to transform how you communicate?
                                    </h2>
                                    <p className="mt-4 text-lg leading-6 text-blue-100">
                                        Join thousands of users already enjoying
                                        seamless communication with ChatSync.
                                        Get started in seconds - no credit card
                                        required.
                                    </p>
                                    <div className="mt-8 flex justify-center">
                                        {!auth.user && (
                                            <div className="inline-flex rounded-md shadow">
                                                <Link
                                                    href={route("register")}
                                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                                                >
                                                    Sign up for free
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 pb-12">
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                &copy; {new Date().getFullYear()} ChatSync. All
                                rights reserved.
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
