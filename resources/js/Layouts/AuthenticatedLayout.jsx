import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import Notifications from "@/Layouts/Components/Notifications";
import NotificationButton from "@/Layouts/Components/NavIcons/NotificationButton";
import NotificationDisplay from "@/Layouts/Components/NotificationDisplay";
import "react-toastify/dist/ReactToastify.css";
import MobileMenu from "./Components/MobileMenu";
import { ToastContainer } from "react-toastify";
import UserDropdown from "./Components/UserDropdown";
import Logo from "@/Components/Welcome/Header/Logo";
import MenuToggleIcon from "./Components/NavIcons/MenuToggleIcon";

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const {
        notifications,
        unreadCount,
        showNotifications,
        markAsRead,
        markAllAsRead,
        toggleNotifications,
        handleNotificationClick,
        setUnreadCount,
    } = Notifications({ user });

    const isMobileView =
        typeof window !== "undefined" && window.innerWidth <= 640;

    useEffect(() => {
        if ((showNotifications || showingNavigationDropdown) && isMobileView) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showNotifications, showingNavigationDropdown, isMobileView]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <Logo className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center" />
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
                            <UserDropdown user={user} />
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
                                    setUnreadCount={setUnreadCount}
                                />
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <NotificationButton
                                unreadCount={unreadCount}
                                onClick={toggleNotifications}
                                isMobile={true}
                            />

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-200 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500 dark:hover:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-500 dark:focus:text-gray-100 focus:outline-none cursor-pointer"
                            >
                                <MenuToggleIcon
                                    showingNavigationDropdown={
                                        showingNavigationDropdown
                                    }
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <NotificationDisplay
                    showNotifications={showNotifications}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    markAllAsRead={markAllAsRead}
                    markAsRead={markAsRead}
                    handleNotificationClick={handleNotificationClick}
                    isMobile={true}
                    onClose={() => toggleNotifications()}
                    setUnreadCount={setUnreadCount}
                />

                <MobileMenu
                    showingNavigationDropdown={showingNavigationDropdown}
                    user={user}
                    onClose={() => setShowingNavigationDropdown(false)}
                />
            </nav>

            <main>{children}</main>

            <ToastContainer
                position={isMobileView ? "bottom-center" : "top-right"}
                autoClose={isMobileView ? 3000 : 5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastClassName={
                    isMobileView ? "toast-custom toast-mobile" : "toast-custom"
                }
                bodyClassName={
                    isMobileView
                        ? "toast-body-custom toast-body-mobile"
                        : "toast-body-custom"
                }
                progressClassName={
                    isMobileView
                        ? "toast-progress-custom toast-progress-mobile"
                        : "toast-progress-custom"
                }
                style={
                    isMobileView
                        ? {
                              zIndex: 9999,
                              width: "90%",
                              left: "5%",
                              right: "5%",
                              fontSize: "1rem",
                          }
                        : { zIndex: 9999 }
                }
            />
        </div>
    );
}
