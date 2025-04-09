import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();

        window.Echo.private(`message.${user.id}`).listen("MessageSent", (e) => {
            const newNotification = {
                id: `temp-${Date.now()}`,
                sender: e.user,
                content: "sent you a message",
                created_at: new Date().toISOString(),
                is_read: false,
            };

            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prevCount) => prevCount + 1);

            setTimeout(fetchNotifications, 1000);
        });

        return () => {
            window.Echo.leave(`message.${user.id}`);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route("notifications.index"));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId, event) => {
        if (event) {
            event.stopPropagation();
        }

        try {
            await axios.post(
                route("notifications.markAsRead", { id: notificationId })
            );
            setNotifications(
                notifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route("notifications.markAllAsRead"));
            setNotifications(
                notifications.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showNotifications &&
                !event.target.closest(".notification-container")
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-700 bg-gray-900">
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
                                    className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium leading-5 text-white hover:text-white focus:outline-none focus:text-white transition duration-150 ease-in-out"
                                    activeClassName="border-indigo-400 text-white"
                                >
                                    Inbox
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="notification-container relative">
                                <button
                                    onClick={toggleNotifications}
                                    className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                >
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-500 justify-center items-center text-xs text-white">
                                                {unreadCount > 99
                                                    ? "99+"
                                                    : unreadCount}
                                            </span>
                                        </span>
                                    )}
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </button>

                                {/* Notifications dropdown */}
                                {showNotifications && (
                                    <div className="notification-container absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                            <h3 className="text-lg font-semibold text-white">
                                                Notifications
                                            </h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-blue-400 hover:text-blue-300"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-400">
                                                No notifications
                                            </div>
                                        ) : (
                                            <div>
                                                {notifications.map(
                                                    (notification, index) => (
                                                        <div
                                                            key={
                                                                notification.id ||
                                                                index
                                                            }
                                                            className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer relative ${
                                                                !notification.is_read
                                                                    ? "bg-gray-700/50 border-l-4 border-l-blue-500"
                                                                    : "opacity-80"
                                                            }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0">
                                                                    {notification
                                                                        .sender
                                                                        ?.avatar ? (
                                                                        <img
                                                                            src={`/storage/${notification.sender.avatar}`}
                                                                            alt={
                                                                                notification
                                                                                    .sender
                                                                                    ?.name ||
                                                                                "User"
                                                                            }
                                                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                                            {notification.sender?.name
                                                                                ?.charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() ||
                                                                                "?"}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-3 flex-grow">
                                                                    <p
                                                                        className={`text-sm font-medium ${
                                                                            !notification.is_read
                                                                                ? "text-white"
                                                                                : "text-gray-300"
                                                                        }`}
                                                                    >
                                                                        {notification
                                                                            .sender
                                                                            ?.name ||
                                                                            "User"}{" "}
                                                                        {
                                                                            notification.content
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {new Date(
                                                                            notification.created_at
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                {/* Mark as read button */}
                                                                {!notification.is_read &&
                                                                    notification.id &&
                                                                    !notification.id
                                                                        .toString()
                                                                        .startsWith(
                                                                            "temp-"
                                                                        ) && (
                                                                        <button
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                markAsRead(
                                                                                    notification.id,
                                                                                    e
                                                                                )
                                                                            }
                                                                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-1 rounded text-center transition-colors duration-150 ml-2 flex-shrink-0"
                                                                            title="Mark as read"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-3 w-3"
                                                                                viewBox="0 0 20 20"
                                                                                fill="currentColor"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-200 transition duration-150 ease-in-out hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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

                                    <Dropdown.Content contentClasses="bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 text-gray-200">
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm hover:bg-gray-700 text-white hover:text-white focus:bg-gray-700 focus:text-white active:bg-gray-700 active:text-white transition ease-in-out duration-150"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-white hover:text-white focus:bg-gray-700 focus:text-white active:bg-gray-700 active:text-white transition ease-in-out duration-150"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile notifications - update with correct unreadCount */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={toggleNotifications}
                                className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                            >
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 justify-center items-center text-xs text-white">
                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount}
                                        </span>
                                    </span>
                                )}
                                <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
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

                {/* Mobile notifications dropdown */}
                {showNotifications && (
                    <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
                        <div className="notification-container bg-gray-800 border border-gray-700 rounded-md shadow-lg w-11/12 max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <h3 className="text-lg font-semibold text-white">
                                    Notifications
                                </h3>
                                <div className="flex space-x-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-400 hover:text-blue-300"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">
                                    No notifications
                                </div>
                            ) : (
                                <div>
                                    {notifications.map(
                                        (notification, index) => (
                                            <div
                                                key={notification.id || index}
                                                className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer relative ${
                                                    !notification.is_read
                                                        ? "bg-gray-700/50 border-l-4 border-l-blue-500"
                                                        : "opacity-80"
                                                }`}
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className={`w-10 h-10 rounded-full ${
                                                                !notification.is_read
                                                                    ? "bg-indigo-500"
                                                                    : "bg-gray-600"
                                                            } flex items-center justify-center text-white font-bold`}
                                                        >
                                                            {notification.sender?.name?.charAt(
                                                                0
                                                            ) || "?"}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3 flex-grow">
                                                        <p
                                                            className={`text-sm font-medium ${
                                                                !notification.is_read
                                                                    ? "text-white"
                                                                    : "text-gray-300"
                                                            }`}
                                                        >
                                                            {notification.sender
                                                                ?.name ||
                                                                "User"}{" "}
                                                            {
                                                                notification.content
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(
                                                                notification.created_at
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {/* Mark as read button */}
                                                    {!notification.is_read &&
                                                        notification.id &&
                                                        !notification.id
                                                            .toString()
                                                            .startsWith(
                                                                "temp-"
                                                            ) && (
                                                            <button
                                                                onClick={(e) =>
                                                                    markAsRead(
                                                                        notification.id,
                                                                        e
                                                                    )
                                                                }
                                                                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded text-center transition-colors duration-150 ml-2 flex-shrink-0"
                                                                title="Mark as read"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
