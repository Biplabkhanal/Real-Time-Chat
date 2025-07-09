export default function Footer() {
    return (
        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 pb-12">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} ChatSync. All rights reserved.
            </div>
        </footer>
    );
}
