import { useState, useEffect, useRef } from "react";
import ThemeDropdown from "./ThemeDropdown";
import UserDropdown from "./UserDropdown";
import GuestNavigation from "./GuestNavigation";

export default function Navigation({ auth }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const mobileMenuRef = useRef(null);
    const toggleButtonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setShowMobileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <nav className="-mx-3 flex flex-1 justify-end">
                <div className="hidden sm:flex sm:items-center sm:space-x-2">
                    <ThemeDropdown />
                    {auth.user ? <UserDropdown /> : <GuestNavigation />}
                </div>

                <div className="sm:hidden">
                    <button
                        ref={toggleButtonRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMobileMenu(!showMobileMenu);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        aria-expanded={showMobileMenu}
                    >
                        <span className="sr-only">
                            {showMobileMenu
                                ? "Close main menu"
                                : "Open main menu"}
                        </span>
                        {!showMobileMenu ? (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {showMobileMenu && (
                <div
                    ref={mobileMenuRef}
                    className="absolute top-full right-0 mt-2 w-[14rem] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 sm:hidden z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="py-2">
                        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                            <ThemeDropdown />
                        </div>
                        <div className="px-3 py-2">
                            {auth.user ? <UserDropdown /> : <GuestNavigation />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
