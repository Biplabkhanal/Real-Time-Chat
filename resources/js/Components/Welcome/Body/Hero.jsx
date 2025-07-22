import React from "react";
import { Link } from "@inertiajs/react";

export default function Hero({ auth }) {
    return (
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Connect in real-time with</span>
                <span className="block text-blue-600 dark:text-blue-400">
                    ChatSync
                </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Seamless, secure, and fast messaging for teams and individuals.
                Chat with anyone, anywhere, anytime.
            </p>
            <div className="mt-8 flex justify-center">
                {!auth.user && (
                    <>
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                href={route("register")}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-100 group-hover:text-white transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                Get Started Free
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link
                                href={route("login")}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
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
    );
}
