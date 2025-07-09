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
            <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4 mb-3">
                    <UserAvatar user={user} size="md" />
                    <div>
                        <h4 className="font-medium text-white">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>
                <div className="flex justify-end">{renderActionButtons()}</div>
            </div>
        );
    }
);

UserCard.displayName = "UserCard";

export default UserCard;
