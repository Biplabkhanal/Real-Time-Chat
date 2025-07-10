import React from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";

export default function NavigationMenu() {
    return (
        <div className="flex">
            <div className="flex shrink-0 items-center">
                <Link href="/">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
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
                        <span className="sm:inline">ChatSync</span>
                    </div>
                </Link>
            </div>

            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <NavLink
                    href={route("inbox")}
                    active={route().current("inbox")}
                    className="font-medium leading-5 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white"
                >
                    Inbox
                </NavLink>
                <NavLink
                    href={route("friend-requests.index")}
                    active={route().current("friend-requests.index")}
                    className="font-medium leading-5 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white"
                >
                    Friends
                </NavLink>
            </div>
        </div>
    );
}
