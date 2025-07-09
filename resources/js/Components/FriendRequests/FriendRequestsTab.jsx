import { memo } from "react";
import FriendRequestCard from "./FriendRequestCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { ChatIcon } from "./icons";

const FriendRequestsTab = memo(
    ({
        pendingRequests,
        onAcceptRequest,
        onDeclineRequest,
        loadingUsers,
        loading,
    }) => {
        if (loading) {
            return (
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="py-12">
                            <LoadingSpinner
                                size="md"
                                text="Loading friend requests..."
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-white mb-6">
                        Pending Friend Requests ({pendingRequests.length})
                    </h2>

                    {pendingRequests.length > 0 ? (
                        <div className="space-y-4">
                            {pendingRequests.map((request) => (
                                <FriendRequestCard
                                    key={request.id}
                                    request={request}
                                    onAcceptRequest={onAcceptRequest}
                                    onDeclineRequest={onDeclineRequest}
                                    isLoading={loadingUsers.has(request.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            description="No pending friend requests"
                            icon={ChatIcon}
                        />
                    )}
                </div>
            </div>
        );
    }
);

FriendRequestsTab.displayName = "FriendRequestsTab";

export default FriendRequestsTab;
