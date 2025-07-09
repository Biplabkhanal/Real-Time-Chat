import { memo } from "react";
import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/Components/LoadingSpinner";

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
                                        loadingUsers.has(
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
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    )}
                                />
                            )}

                        {searchQuery.trim() === "" &&
                            usersToDisplay.length === 0 && (
                                <EmptyState
                                    description="No users available to add"
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
                )}
            </div>
        );
    }
);

AddFriendTab.displayName = "AddFriendTab";

export default AddFriendTab;
