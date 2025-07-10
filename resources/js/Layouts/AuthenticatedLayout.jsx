import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import Dropdown from "@/Components/Dropdown";

// Import Components
import NavigationMenu from "@/Layouts/Components/NavigationMenu";
import MobileMenu from "@/Layouts/Components/MobileMenu";
import Notifications from "@/Layouts/Components/Notifications";
import NotificationButton from "@/Layouts/Components/NotificationButton";
import NotificationDisplay from "@/Layouts/Components/NotificationDisplay";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Import notification functionality from the Notifications hook
    const {
        notifications,
        unreadCount,
        showNotifications,
        markAsRead,
        markAllAsRead,
        toggleNotifications,
        handleNotificationClick,
    } = Notifications({ user });

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                    <div className="flex h-16 justify-between">
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
                                        ChatSync
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
                                    active={route().current(
                                        "friend-requests.index"
                                    )}
                                    className="font-medium leading-5 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white"
                                >
                                    Friends
                                </NavLink>
                            </div>
                        </div>

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
                                            href={route("profile.edit")}
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
                            <div className="notification-container relative">
                                <NotificationButton
                                    unreadCount={unreadCount}
                                    onClick={toggleNotifications}
                                />

                                <NotificationDisplay
                                    showNotifications={showNotifications}
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    markAllAsRead={markAllAsRead}
                                    markAsRead={markAsRead}
                                    handleNotificationClick={
                                        handleNotificationClick
                                    }
                                    isMobile={false}
                                />
                            </div>
                        </div>

                        {/* Mobile Navigation Controls */}
                        <div className="-me-2 flex items-center sm:hidden">
                            {/* Notification Button - Mobile */}
                            <NotificationButton
                                unreadCount={unreadCount}
                                onClick={toggleNotifications}
                                isMobile={true}
                            />

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-200 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500 dark:hover:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-500 dark:focus:text-gray-100 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Notification Display */}
                <NotificationDisplay
                    showNotifications={showNotifications}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    markAllAsRead={markAllAsRead}
                    markAsRead={markAsRead}
                    handleNotificationClick={handleNotificationClick}
                    isMobile={true}
                    onClose={() => toggleNotifications()}
                />

                {/* Mobile Menu */}
                <MobileMenu
                    showingNavigationDropdown={showingNavigationDropdown}
                    user={user}
                />
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
