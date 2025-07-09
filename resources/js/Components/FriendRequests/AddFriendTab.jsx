import { memo } from "react";
import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { SearchIcon, UsersIcon } from "./icons";

const AddFriendTab = memo(
    ({
        searchQuery,
        onSearchChange,
        isSearching,
        loading,
        usersToDisplay,
        onSendFriendRequest,
        onCancelFriendRequest,
        onAcceptFriendRequest,
        loadingUsers,
        acceptingUsers,
    }) => {
        return (
            <div className="space-y-6">
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    isSearching={isSearching}
                />

                {(isSearching || loading) && (
                    <div className="text-center py-8">
                        <LoadingSpinner
                            size="md"
                            text={loading ? "Loading users..." : "Searching..."}
                        />
                    </div>
                )}

                {!isSearching && !loading && (
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4">
                            {searchQuery.trim() === ""
                                ? "All Users"
                                : "Search Results"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {usersToDisplay.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onSendFriendRequest={onSendFriendRequest}
                                    onCancelFriendRequest={
                                        onCancelFriendRequest
                                    }
                                    onAcceptFriendRequest={
                                        onAcceptFriendRequest
                                    }
                                    isLoading={
                                        loadingUsers.has(user.id) ||
                                        loadingUsers.has(
                                            user.sent_request_id
                                        ) ||
                                        acceptingUsers.has(
                                            user.received_request_id
                                        )
                                    }
                                />
                            ))}
                        </div>

                        {/* Empty States */}
                        {searchQuery.trim() !== "" &&
                            usersToDisplay.length === 0 && (
                                <EmptyState
                                    description="No users found"
                                    icon={SearchIcon}
                                />
                            )}

                        {searchQuery.trim() === "" &&
                            usersToDisplay.length === 0 && (
                                <EmptyState
                                    description="No users available to add"
                                    icon={UsersIcon}
                                />
                            )}
                    </div>
                )}
            </div>
        );
    }
);

AddFriendTab.displayName = "AddFriendTab";

export default AddFriendTab;
