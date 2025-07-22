import Dropdown from "@/Components/Dropdown";
import ThemeSettings from "@/Components/inbox/Chat/Header/ThemeSettings";
import ThemeIcon from "./ThemeIcon";
import ChevronDownIcon from "./ChevronDownIcon";

export default function ThemeDropdown() {
    return (
        <div className="w-full">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md w-full">
                        <button
                            type="button"
                            className="inline-flex items-center justify-between w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <div className="flex items-center">
                                <ThemeIcon className="h-5 w-5" />
                                <span className="ml-2">Theme</span>
                            </div>
                            <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content contentClasses="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 text-gray-700 dark:text-gray-200 w-[14rem] sm:w-64 -ml-5 sm:ml-0">
                    <div className="py-1">
                        <ThemeSettings />
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
