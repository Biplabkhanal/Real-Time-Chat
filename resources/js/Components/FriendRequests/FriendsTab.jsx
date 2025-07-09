import { memo } from "react";
import FriendCard from "./FriendCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/Components/LoadingSpinner";

const FriendsTab = memo(
    ({ friends, onRemoveFriend, onGoToAddFriend, loadingUsers, loading }) => {
        if (loading) {
            return (
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="py-12">
                            <LoadingSpinner
                                size="md"
                                text="Loading friends..."
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
                        Your Friends ({friends.length})
                    </h2>

                    {friends.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {friends.map((friend) => (
                                <FriendCard
                                    key={friend.id}
                                    friend={friend}
                                    onRemoveFriend={onRemoveFriend}
                                    isLoading={loadingUsers.has(friend.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            description="No friends yet. Start by adding some friends!"
                            actionText="Go to Add Friend"
                            onAction={onGoToAddFriend}
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
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

FriendsTab.displayName = "FriendsTab";

export default FriendsTab;
