import { memo } from "react";
import UserAvatar from "./UserAvatar";
import ActionButton from "./ActionButton";

const FriendRequestCard = memo(
    ({ request, onAcceptRequest, onDeclineRequest, isLoading = false }) => {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                    <UserAvatar user={request.sender} size="md" />
                    <div>
                        <h4 className="font-medium text-white">
                            {request.sender.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {request.sender.email}
                        </p>
                        <p className="text-xs text-gray-500">
                            {new Date(request.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <ActionButton
                        type="primary"
                        onClick={() => onAcceptRequest(request.id)}
                        isLoading={isLoading}
                        loadingText="Accepting..."
                        size="sm"
                    >
                        Accept
                    </ActionButton>
                    <ActionButton
                        type="danger"
                        onClick={() => onDeclineRequest(request.id)}
                        isLoading={isLoading}
                        loadingText="Declining..."
                        size="sm"
                    >
                        Decline
                    </ActionButton>
                </div>
            </div>
        );
    }
);

FriendRequestCard.displayName = "FriendRequestCard";

export default FriendRequestCard;
