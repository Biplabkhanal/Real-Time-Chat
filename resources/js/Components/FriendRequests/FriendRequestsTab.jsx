import { memo } from "react";
import FriendRequestCard from "./FriendRequestCard";
import EmptyState from "./EmptyState";

const FriendRequestsTab = memo(
    ({ pendingRequests, onAcceptRequest, onDeclineRequest, loadingUsers }) => {
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
                            icon={({ className }) => (
                                <svg
                                    className={className}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                    />
                                </svg>
                            )}
                        />
                    )}
                </div>
            </div>
        );
    }
);

FriendRequestsTab.displayName = "FriendRequestsTab";

export default FriendRequestsTab;
