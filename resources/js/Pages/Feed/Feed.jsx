import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FeedTab from "./FeedTab";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { useState, useEffect } from "react";

export default function Feed({ auth, csrf_token }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

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
                <div className="max-w-2xl mx-auto p-1 sm:p-6">
                    {loading ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <LoadingSpinner size="lg" text="Loading feed..." />
                        </div>
                    ) : (
                        <FeedTab csrf_token={csrf_token} user={auth.user} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
