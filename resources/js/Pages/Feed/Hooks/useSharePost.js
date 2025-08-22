import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { filterBlockedUsers } from "@/utils/filterBlockedUsers";

export function useSharePost() {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchFriendsAndBlocked = async () => {
            try {
                setIsFetching(true);
                const [friendsRes, blockedRes, blockedByRes] =
                    await Promise.all([
                        axios.get("/friends"),
                        axios.get("/blocked-users"),
                        axios.get("/blocked-by-users"),
                    ]);
                const filteredFriends = filterBlockedUsers(
                    friendsRes.data,
                    blockedRes.data,
                    blockedByRes.data
                );
                setFriends(filteredFriends);
            } catch (error) {
                toast.error("Failed to load friends or blocked users");
                console.error(
                    "Error fetching friends or blocked users:",
                    error
                );
            } finally {
                setIsFetching(false);
            }
        };
        fetchFriendsAndBlocked();
    }, []);

    const sharePost = async (postId) => {
        setIsLoading(true);
        try {
            await Promise.all(
                selectedFriends.map((friendId) =>
                    axios.post(`/share-post/${postId}/to/${friendId}`)
                )
            );
            toast.success("Post shared successfully!");
        } catch (error) {
            toast.error("Failed to share post");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        friends,
        selectedFriends,
        setSelectedFriends,
        isLoading,
        isFetching,
        sharePost,
    };
}
