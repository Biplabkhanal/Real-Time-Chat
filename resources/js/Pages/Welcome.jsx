import { WelcomeLayout } from "@/Components/Welcome";
import Logo from "@/Components/Welcome/Header/Logo";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome({ auth, reviews }) {
    const [reviewData, setReviewData] = useState(reviews || []);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (reviews) {
            setReviewData(reviews);
        }
    }, [reviews]);

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            current += 10;
            setProgress(current);
            if (current >= 100) {
                clearInterval(interval);
                setLoading(false);
            }
        }, 150);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black dark:text-white/50">
                <div className="flex flex-col items-center mb-6">
                    <Logo className="h-20 w-auto text-4xl" />
                </div>
                <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <span className="text-sm text-gray-500">{progress}%</span>
            </div>
        );
    }

    return (
        <>
            <Head title="ChatSync - Real-Time Chat App" />
            <WelcomeLayout auth={auth} reviews={reviewData} />
        </>
    );
}
