import { memo } from "react";
import UserAvatar from "./UserAvatar";
import ActionButton from "./ActionButton";
import { CancelIcon, CheckIcon, AddFriendIcon } from "./icons";

const UserCard = memo(
    ({
        user,
        onSendFriendRequest,
        onCancelFriendRequest,
        onAcceptFriendRequest,
        isLoading,
    }) => {
        const renderActionButtons = () => {
            if (user.is_friend) {
                return <span className="text-sm text-green-400">Friend</span>;
            }

            if (user.has_sent_request || user.has_pending_request) {
                return (
                    <div className="flex space-x-2">
                        {user.sent_request_id && (
                            <ActionButton
                                type="danger"
                                onClick={() =>
                                    onCancelFriendRequest(user.sent_request_id)
                                }
                                isLoading={isLoading}
                                loadingText="Canceling..."
                                size="sm"
                                icon={CancelIcon}
                            >
                                Cancel
                            </ActionButton>
                        )}
                    </div>
                );
            }

            if (user.has_received_request) {
                return (
                    <ActionButton
                        type="primary"
                        onClick={() =>
                            onAcceptFriendRequest(user.received_request_id)
                        }
                        isLoading={isLoading}
                        loadingText="Accepting..."
                        size="sm"
                        icon={CheckIcon}
                    >
                        Accept
                    </ActionButton>
                );
            }

            return (
                <ActionButton
                    type="primary"
                    onClick={() => onSendFriendRequest(user.id)}
                    isLoading={isLoading}
                    loadingText="Sending..."
                    size="sm"
                    icon={AddFriendIcon}
                >
                    Add Friend
                </ActionButton>
            );
        };

        return (
            <div className="p-4 bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl transition-colors">
                <div className="flex items-center space-x-4 mb-3">
                    <UserAvatar user={user} size="md" />
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white text-base">
                            {user.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                        </p>
                        {user.mutualFriends &&
                            user.mutualFriends.length > 0 && (
                                <div className="mt-1 flex items-center gap-0">
                                    {user.mutualFriends
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, 2)
                                        .map((friend) => (
                                            <UserAvatar
                                                key={friend.id}
                                                user={friend}
                                                size="xs"
                                            />
                                        ))}
                                    <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
                                        {user.mutualFriends.length} mutual
                                        friend
                                        {user.mutualFriends.length > 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                            )}
                    </div>
                </div>
                <div className="flex justify-end mt-2">
                    {renderActionButtons()}
                </div>
            </div>
        );
    }
);

UserCard.displayName = "UserCard";

export default UserCard;
