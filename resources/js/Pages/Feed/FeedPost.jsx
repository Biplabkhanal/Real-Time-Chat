import { UserAvatar } from "../../Components/FriendRequests";

export default function FeedPost({ post }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center mb-3">
                <UserAvatar user={post.user || { name: "User" }} size="sm" />
                <div className="ml-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {post.user?.name || "User"}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {post.created_at
                            ? new Date(post.created_at).toLocaleString()
                            : ""}
                    </div>
                </div>
            </div>
            <div className="text-gray-900 dark:text-white mb-2 text-base">
                {post.content}
            </div>
            {post.image_path && (
                <img
                    src={`/storage/${post.image_path}`}
                    alt="Post"
                    className="rounded-lg max-h-96 w-full object-cover mb-2"
                />
            )}
        </div>
    );
}
