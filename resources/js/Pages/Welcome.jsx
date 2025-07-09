import { WelcomeLayout } from "@/Components/Welcome";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome({ auth, reviews, laravelVersion, phpVersion }) {
    const [reviewData, setReviewData] = useState(reviews || []);

    useEffect(() => {
        if (reviews) {
            setReviewData(reviews);
        }
    }, [reviews]);

    return (
        <>
            <Head title="ChatSync - Real-Time Chat App" />
            <WelcomeLayout auth={auth} reviews={reviewData} />
        </>
    );
}
