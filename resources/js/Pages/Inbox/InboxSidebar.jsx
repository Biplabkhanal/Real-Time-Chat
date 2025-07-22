import React from "react";
import AddButton from "@/Components/inbox/Shared/Icons/AddButton";
import UserList from "@/Components/inbox/UserList/UserList";

const InboxSidebar = ({
    showSidebar,
    isUsersLoading,
    usersWithConversations,
    selectedUser,
    handleUserSelect,
    onlineUsers,
    setIsModalOpen,
}) => (
    <div
        className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-1/4 w-full md:static fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out shadow-lg md:shadow-none`}
    >
        <div className="px-4 py-[1.64rem] bg-gray-50 dark:bg-gray-900 font-bold text-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-gray-800 dark:text-white">Chats</h2>
                {isUsersLoading ? (
                    <div className="w-6 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                ) : (
                    <span className="bg-blue-500 text-white text-xs px-1 py-0 rounded-full">
                        {usersWithConversations.length}
                    </span>
                )}
            </div>
            <AddButton onClick={() => setIsModalOpen(true)} />
        </div>
        <UserList
            filteredUsers={usersWithConversations}
            selectedUser={selectedUser}
            setSelectedUser={handleUserSelect}
            onlineUsers={onlineUsers}
            isLoading={isUsersLoading}
        />
    </div>
);

export default InboxSidebar;
