import { memo } from "react";
import FriendCard from "./FriendCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { UsersIcon } from "./icons";

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
                            icon={UsersIcon}
                        />
                    )}
                </div>
            </div>
        );
    }
);

FriendsTab.displayName = "FriendsTab";

export default FriendsTab;
