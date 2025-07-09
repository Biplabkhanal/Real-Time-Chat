import { Link } from "@inertiajs/react";
import PrimaryButton from "../../../PrimaryButton";

export default function NoFriendsState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
            <div className="text-center max-w-md">
                <div className="mb-6">
                    <svg
                        className="w-24 h-24 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                    </svg>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                    No Friends Yet
                </h3>

                <p className="text-gray-300 mb-6">
                    You need to add friends before you can start chatting.
                    Connect with people you know to begin messaging!
                </p>

                <Link href="/friend-requests">
                    <PrimaryButton>Add Friends</PrimaryButton>
                </Link>
            </div>
        </div>
    );
}
