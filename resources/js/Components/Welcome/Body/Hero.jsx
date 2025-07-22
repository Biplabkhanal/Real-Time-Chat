import React from "react";
import { Link } from "@inertiajs/react";
import { LoginIcon, RegisterIcon } from "../Icons/AuthIcons";

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
                                <RegisterIcon className="w-4 h-4 mr-2 text-blue-100 group-hover:text-white transition-colors" />
                                Get Started Free
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link
                                href={route("login")}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <LoginIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
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
