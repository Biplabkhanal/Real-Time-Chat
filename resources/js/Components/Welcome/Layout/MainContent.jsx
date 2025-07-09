import AppDemo from "@/Components/AppDemo";
import CallToAction from "@/Components/CallToAction";
import FeaturesGrid from "@/Components/FeaturesGrid";
import Hero from "@/Components/Hero";
import ReviewSection from "@/Components/ReviewSection";

export default function MainContent({ auth, reviews }) {
    return (
        <main className="mt-6">
            <Hero auth={auth} />
            <FeaturesGrid />
            <AppDemo />
            <ReviewSection reviews={reviews} auth={auth} />
            <CallToAction auth={auth} />
        </main>
    );
}
