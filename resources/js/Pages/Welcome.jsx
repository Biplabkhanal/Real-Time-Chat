import AppDemo from "@/Components/AppDemo";
import CallToAction from "@/Components/CallToAction";
import Dropdown from "@/Components/Dropdown";
import FeaturesGrid from "@/Components/FeaturesGrid";
import Hero from "@/Components/Hero";
import ThemeSettings from "@/Components/inbox/ChatHeader/ThemeSettings";
import ReviewSection from "@/Components/ReviewSection";
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
                                <div className="mx-2">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="ml-2">
                                                        Theme
                                                    </span>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content contentClasses="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 text-gray-700 dark:text-gray-200 w-64">
                                            <div className="py-1">
                                                <ThemeSettings />
                                            </div>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>

                                {auth.user ? (
                                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                        <div className="relative ms-3">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

                                                <Dropdown.Content contentClasses="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 text-gray-700 dark:text-gray-200">
                                                    <Dropdown.Link
                                                        href={route("inbox")}
                                                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white active:bg-gray-100 dark:active:bg-gray-700 active:text-gray-900 dark:active:text-white transition ease-in-out duration-150"
                                                    >
                                                        Inbox
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "profile.edit"
                                                        )}
                                                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white active:bg-gray-100 dark:active:bg-gray-700 active:text-gray-900 dark:active:text-white transition ease-in-out duration-150"
                                                    >
                                                        Profile
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white active:bg-gray-100 dark:active:bg-gray-700 active:text-gray-900 dark:active:text-white transition ease-in-out duration-150"
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
                            <Hero auth={auth} />
                            <FeaturesGrid />
                            <AppDemo />
                            <ReviewSection reviews={reviews} auth={auth} />
                            <CallToAction auth={auth} />
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
