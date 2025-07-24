import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UpdateAvatarForm from "./Partials/UpdateAvatarForm";
import BlockedUsersForm from "./Partials/BlockedUsersForm";

export default function Edit({ mustVerifyEmail, status }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <Head title="ChatSync - Profile" />
                <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="ChatSync - Profile" />
            <div className="py-12 relative min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="w-full bg-white/50 dark:bg-gray-800/50 p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 sm:rounded-lg backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <div className="space-y-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="w-full"
                            />
                            <hr className="border-gray-200/50 dark:border-gray-700/50" />
                            <UpdateAvatarForm className="w-full" />
                            <hr className="border-gray-200/50 dark:border-gray-700/50" />
                            <UpdatePasswordForm className="w-full" />
                        </div>
                    </div>

                    <div className="w-full bg-white/50 dark:bg-gray-800/50 p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 sm:rounded-lg backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <BlockedUsersForm className="w-full" />
                    </div>

                    <div className="w-full bg-white/50 dark:bg-gray-800/50 p-6 shadow-md border border-red-200/50 dark:border-red-700/50 sm:rounded-lg backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <DeleteUserForm className="w-full" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
