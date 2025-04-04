import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import BlockUserModal from "@/Components/inbox/ChatHeader/BlockUserModal";

export default function BlockedUsersForm({ className = "" }) {
    const { auth } = usePage().props;
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [selectedUserToUnblock, setSelectedUserToUnblock] = useState(null);

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    const fetchBlockedUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/blocked-users");
            setBlockedUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load blocked users");
            setLoading(false);
            console.error("Error fetching blocked users:", err);
        }
    };

    const openUnblockModal = (user) => {
        setSelectedUserToUnblock(user);
        setShowUnblockModal(true);
    };

    const handleUnblock = async (userId) => {
        try {
            await axios.delete(`/unblock-user/${userId}`);
            setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
            setShowUnblockModal(false);
        } catch (err) {
            setError("Failed to unblock user");
            console.error("Error unblocking user:", err);
            setShowUnblockModal(false);
        }
    };

    return (
        <section
            className={`${className} p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
        >
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Blocked Users
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Manage the users you have blocked. Blocked users cannot
                    message you or see your status.
                </p>
            </header>

            <div className="mt-6 space-y-6">
                {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading blocked users...
                    </p>
                ) : error ? (
                    <p className="text-sm text-red-500 dark:text-red-400">
                        {error}
                    </p>
                ) : blockedUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        You haven't blocked any users.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {blockedUsers.map((user) => (
                            <li
                                key={user.id}
                                className="py-4 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    {user.avatar ? (
                                        <img
                                            src={`/storage/${user.avatar}`}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openUnblockModal(user)}
                                    type="button"
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                >
                                    Unblock
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showUnblockModal && selectedUserToUnblock && (
                <BlockUserModal
                    onConfirm={() => handleUnblock(selectedUserToUnblock.id)}
                    onCancel={() => setShowUnblockModal(false)}
                    userId={selectedUserToUnblock.id}
                    isBlocked={true}
                    userName={selectedUserToUnblock.name}
                />
            )}
        </section>
    );
}
