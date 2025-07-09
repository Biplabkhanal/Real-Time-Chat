import { memo } from "react";
import { router } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import ActionButton from "./ActionButton";
import SecondaryButton from "@/Components/SecondaryButton";

const FriendCard = memo(({ friend, onRemoveFriend, isLoading = false }) => {
    const handleMessage = () => {
        router.visit(`/inbox?user=${friend.id}`);
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4 mb-3">
                <UserAvatar user={friend} size="md" showOnlineStatus={true} />
                <div>
                    <h4 className="font-medium text-white">{friend.name}</h4>
                    <p className="text-sm text-gray-400">
                        {friend.is_online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
            <div className="flex space-x-2">
                <SecondaryButton
                    onClick={handleMessage}
                    className="flex-1 text-sm justify-center"
                >
                    Message
                </SecondaryButton>
                <ActionButton
                    type="danger"
                    onClick={() => onRemoveFriend(friend.id)}
                    isLoading={isLoading}
                    loadingText="Removing..."
                    size="sm"
                >
                    Remove
                </ActionButton>
            </div>
        </div>
    );
});

FriendCard.displayName = "FriendCard";

export default FriendCard;
