import React from "react";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";

export default function MobileMenu({
    showingNavigationDropdown,
    user,
    onClose,
}) {
    if (!showingNavigationDropdown) return null;

    return (
        <>
            <div
                className="sm:hidden fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            <div className="sm:hidden fixed top-16 inset-x-0 z-50">
                <div className="border-t border-gray-200 dark:border-gray-700 pb-3 pt-4 shadow-lg bg-gray-50 dark:bg-gray-800">
                    <div className="px-4 mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                                {user.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-y-1 px-2">
                        <ResponsiveNavLink
                            href={route("inbox")}
                            active={route().current("inbox")}
                            className="flex items-center"
                            onClick={onClose}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                ></path>
                            </svg>
                            Inbox
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("friend-requests.index")}
                            active={route().current("friend-requests.index")}
                            className="flex items-center"
                            onClick={onClose}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                ></path>
                            </svg>
                            Friends
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("profile.edit")}
                            className="flex items-center"
                            onClick={onClose}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                ></path>
                            </svg>
                            Profile
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                            className="flex items-center w-full"
                            onClick={onClose}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                ></path>
                            </svg>
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </>
    );
}
