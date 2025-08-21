import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FeedTab from "@/Components/FeedTab";

export default function Feed({ auth, csrf_token }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Feed
                </h2>
            }
            auth={auth}
        >
            <Head title="Feed" />
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
                <div className="max-w-2xl mx-auto p-6">
                    <FeedTab csrf_token={csrf_token} user={auth.user} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
