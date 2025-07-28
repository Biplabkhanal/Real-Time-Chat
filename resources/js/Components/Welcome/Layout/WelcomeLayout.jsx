import Header from "../Header/Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WelcomeLayout({ auth, reviews, children }) {
    return (
        <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
            <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <Header auth={auth} />
                    <MainContent auth={auth} reviews={reviews} />
                    <Footer />
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        toastClassName="toast-custom"
                        bodyClassName="toast-body-custom"
                        progressClassName="toast-progress-custom"
                        style={{ zIndex: 9999 }}
                    />
                </div>
            </div>
        </div>
    );
}
