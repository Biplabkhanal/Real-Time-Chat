import AppDemo from "@/Components/Welcome/Body/AppDemo";
import CallToAction from "@/Components/Welcome/Body/CallToAction";
import FeaturesGrid from "@/Components/Welcome/Body/FeaturesGrid";
import Hero from "@/Components/Welcome/Body/Hero";
import ReviewSection from "@/Components/Welcome/Body/ReviewSection";

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
