import { Link } from "@inertiajs/react";
import { LoginIcon, RegisterIcon } from "../Icons/AuthIcons";

export default function GuestNavigation({ closeMobileMenu }) {
    const handleMenuItemClick = () => {
        if (closeMobileMenu) {
            closeMobileMenu();
        }
    };
    return (
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Link
                href={route("login")}
                onClick={handleMenuItemClick}
                className="group w-full sm:w-auto sm:flex-shrink-0 text-center inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
            >
                <LoginIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                Log in
            </Link>

            <Link
                href={route("register")}
                onClick={handleMenuItemClick}
                className="group w-full sm:w-auto sm:flex-shrink-0 text-center inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-sm hover:shadow-md active:bg-blue-800 border border-blue-600 hover:border-blue-700 whitespace-nowrap"
            >
                <RegisterIcon className="w-4 h-4 mr-2 text-blue-100 group-hover:text-white transition-colors" />
                Register
            </Link>
        </div>
    );
}
