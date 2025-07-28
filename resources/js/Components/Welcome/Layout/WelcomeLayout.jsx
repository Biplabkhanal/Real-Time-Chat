import Header from "../Header/Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WelcomeLayout({ auth, reviews, children }) {
    const isMobileView =
        typeof window !== "undefined" && window.innerWidth <= 640;

    return (
        <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
            <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <Header auth={auth} />
                    <MainContent auth={auth} reviews={reviews} />
                    <Footer />
                    <ToastContainer
                        position={isMobileView ? "top-center" : "top-right"}
                        autoClose={isMobileView ? 3000 : 5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        toastClassName={
                            isMobileView
                                ? "toast-custom toast-mobile"
                                : "toast-custom"
                        }
                        bodyClassName={
                            isMobileView
                                ? "toast-body-custom toast-body-mobile"
                                : "toast-body-custom"
                        }
                        progressClassName={
                            isMobileView
                                ? "toast-progress-custom toast-progress-mobile"
                                : "toast-progress-custom"
                        }
                        style={
                            isMobileView
                                ? {
                                      zIndex: 9999,
                                      width: "90%",
                                      left: "5%",
                                      right: "5%",
                                      top: "4%",
                                      fontSize: "1rem",
                                  }
                                : { zIndex: 9999 }
                        }
                    />
                </div>
            </div>
        </div>
    );
}
