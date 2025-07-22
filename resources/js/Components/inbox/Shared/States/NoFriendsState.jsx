import { Link } from "@inertiajs/react";
import PrimaryButton from "../../../PrimaryButton";
import NoFriendsIcon from "../Icons/NoFriendsIcon";

export default function NoFriendsState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
            <div className="text-center max-w-md">
                <div className="mb-6">
                    <NoFriendsIcon />
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
