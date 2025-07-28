import { memo, useState, useCallback } from "react";
import { router } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import ActionButton from "./ActionButton";
import SecondaryButton from "@/Components/SecondaryButton";
import FriendRemoveModal from "./FriendRemoveModal";

const FriendCard = memo(({ friend, onRemoveFriend, isLoading = false }) => {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [pendingRemove, setPendingRemove] = useState(false);

    const handleMessage = () => {
        router.visit(`/inbox?user=${friend.id}`);
    };

    const handleRemoveClick = useCallback(() => {
        setShowRemoveModal(true);
    }, []);

    const handleConfirmRemove = useCallback(() => {
        setPendingRemove(true);
        onRemoveFriend(friend.id);
        setShowRemoveModal(false);
        setPendingRemove(false);
    }, [onRemoveFriend, friend.id]);

    const handleCancelRemove = useCallback(() => {
        setShowRemoveModal(false);
    }, []);

    return (
        <>
            <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4 mb-3">
                    <UserAvatar
                        user={friend}
                        size="md"
                        showOnlineStatus={true}
                    />
                    <div>
                        <h4 className="font-medium text-white">
                            {friend.name}
                        </h4>
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
                        onClick={handleRemoveClick}
                        isLoading={isLoading || pendingRemove}
                        loadingText="Removing..."
                        size="sm"
                    >
                        Remove
                    </ActionButton>
                </div>
            </div>
            <FriendRemoveModal
                show={showRemoveModal}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
                friendName={friend.name}
            />
        </>
    );
});

FriendCard.displayName = "FriendCard";

export default FriendCard;
