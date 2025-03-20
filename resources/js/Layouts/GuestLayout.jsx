import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-dots-darker dark:bg-dots-lighter">
            <div className="transform hover:scale-105 transition-transform duration-200">
                <Link href="/">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
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
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden px-6 py-4 shadow-2xl sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
