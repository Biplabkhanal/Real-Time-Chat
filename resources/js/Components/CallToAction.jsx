import React from "react";
import { Link } from "@inertiajs/react";

export default function CallToAction({ auth }) {
    return (
        <div className="mt-24 bg-gradient-to-r from-blue-800 to-indigo-900 rounded-xl overflow-hidden shadow-xl relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600 opacity-20"></div>
                <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500 opacity-10"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20 sm:py-24 lg:px-8 text-center relative z-10">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Elevate Your Communication Experience
                </h2>
                <p className="mt-6 text-xl leading-7 text-blue-100 max-w-3xl mx-auto">
                    Join thousands of users already enjoying seamless, secure
                    messaging with ChatSync. Start connecting in real-time today
                    — no credit card required.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    {!auth.user ? (
                        <>
                            <Link
                                href={route("register")}
                                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-blue-50 shadow-md transition duration-150 ease-in-out"
                            >
                                <span>Get Started Free</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href={route("login")}
                                className="inline-flex items-center justify-center px-6 py-4 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition duration-150 ease-in-out"
                            >
                                Log In
                            </Link>
                        </>
                    ) : (
                        <Link
                            href={route("inbox")}
                            className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-blue-50 shadow-md transition duration-150 ease-in-out"
                        >
                            <span>Go to Inbox</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    )}
                </div>

                <div className="mt-8 flex justify-center space-x-6">
                    <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-${
                                        i % 2 ? "blue" : "indigo"
                                    }-400 to-${
                                        i % 2 ? "indigo" : "purple"
                                    }-500`}
                                ></div>
                            ))}
                        </div>
                        <span className="text-white text-sm">
                            Join 10,000+ users
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
