import React from "react";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import {
    InboxIcon,
    FriendsIcon,
    ProfileIcon,
    LogoutIcon,
    FeedIcon,
} from "./NavIcons/MobileMenuIcons";

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
                            <InboxIcon />
                            Inbox
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("friend-requests.index")}
                            active={route().current("friend-requests.index")}
                            className="flex items-center"
                            onClick={onClose}
                        >
                            <FriendsIcon />
                            Friends
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("feed.index")}
                            active={route().current("feed.index")}
                            className="flex items-center"
                            onClick={onClose}
                        >
                            {FeedIcon ? <FeedIcon /> : null}
                            Feed
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("profile.edit")}
                            className="flex items-center"
                            onClick={onClose}
                        >
                            <ProfileIcon />
                            Profile
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                            className="flex items-center w-full"
                            onClick={onClose}
                        >
                            <LogoutIcon />
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </>
    );
}
