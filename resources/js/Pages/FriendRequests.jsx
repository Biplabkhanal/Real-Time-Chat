import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import LoadingSpinner from "@/Components/LoadingSpinner";
import TabNavigation from "@/Components/FriendRequests/TabNavigation";
import AddFriendTab from "@/Components/FriendRequests/AddFriendTab";
import FriendRequestsTab from "@/Components/FriendRequests/FriendRequestsTab";
import FriendsTab from "@/Components/FriendRequests/FriendsTab";
import { useFriendRequestsLogic } from "@/Components/FriendRequests/useFriendRequestsLogic";

export default function FriendRequests({
    auth,
    pendingRequests: initialPendingRequests,
    friends: initialFriends,
    csrf_token,
}) {
    const {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isSearching,
        loadingUsers,
        acceptingUsers,
        decliningUsers,
        pendingRequests,
        friends,
        loading,
        loadingRequests,
        loadingFriends,
        loadingAddFriend,
        usersToDisplay,
        sendFriendRequest,
        cancelFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
    } = useFriendRequestsLogic(
        initialPendingRequests,
        initialFriends,
        csrf_token
    );

    const tabs = [
        { key: "addFriend", label: "Add Friend" },
        {
            key: "requests",
            label: "Friend Requests",
            badge: pendingRequests.length > 0 ? pendingRequests.length : null,
        },
        { key: "friends", label: `Friends (${friends.length})` },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Friends & Requests
                </h2>
            }
        >
            <Head title="Friends & Requests" />

            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Friends & Requests
                        </h1>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <LoadingSpinner
                                size="lg"
                                text="Loading friends and requests..."
                            />
                        </div>
                    )}

                    {/* Main Content */}
                    {!loading && (
                        <>
                            <TabNavigation
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                tabs={tabs}
                            />

                            {/* Tab Content */}
                            {activeTab === "addFriend" && (
                                <AddFriendTab
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    isSearching={isSearching}
                                    loading={loadingAddFriend}
                                    usersToDisplay={usersToDisplay}
                                    onSendFriendRequest={sendFriendRequest}
                                    onCancelFriendRequest={cancelFriendRequest}
                                    onAcceptFriendRequest={acceptFriendRequest}
                                    loadingUsers={loadingUsers}
                                    acceptingUsers={acceptingUsers}
                                />
                            )}

                            {activeTab === "requests" && (
                                <FriendRequestsTab
                                    pendingRequests={pendingRequests}
                                    onAcceptRequest={acceptFriendRequest}
                                    onDeclineRequest={declineFriendRequest}
                                    acceptingUsers={acceptingUsers}
                                    decliningUsers={decliningUsers}
                                    loading={loadingRequests}
                                />
                            )}

                            {activeTab === "friends" && (
                                <FriendsTab
                                    friends={friends}
                                    onRemoveFriend={removeFriend}
                                    onGoToAddFriend={() =>
                                        setActiveTab("addFriend")
                                    }
                                    loadingUsers={loadingUsers}
                                    loading={loadingFriends}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
