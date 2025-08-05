import axios from "axios";

export const fetchFriends = async () => {
    try {
        const response = await axios.get("/friends");
        return { data: response.data, error: null };
    } catch (err) {
        console.error("Error fetching friends:", err);
        return { data: null, error: "Failed to load friends" };
    }
};

export const fetchBlockedUsers = async () => {
    try {
        const response = await axios.get("/blocked-users");
        return { data: response.data, error: null };
    } catch (err) {
        console.error("Error fetching blocked users:", err);
        return { data: null, error: "Failed to load blocked users" };
    }
};

export const fetchBlockedByUsers = async () => {
    try {
        const response = await axios.get("/blocked-by-users");
        return { data: response.data, error: null };
    } catch (err) {
        console.error("Error fetching blocked by users:", err);
        return { data: null, error: "Failed to load blocked by users" };
    }
};

export const fetchUserData = async () => {
    try {
        const [friendsResult, blockedResult, blockedByResult] =
            await Promise.all([
                fetchFriends(),
                fetchBlockedUsers(),
                fetchBlockedByUsers(),
            ]);

        return {
            friends: friendsResult.data || [],
            blockedUsers: blockedResult.data || [],
            blockedByUsers: blockedByResult.data || [],
            errors: {
                friends: friendsResult.error,
                blocked: blockedResult.error,
                blockedBy: blockedByResult.error,
            },
        };
    } catch (err) {
        console.error("Error fetching user data:", err);
        return {
            friends: [],
            blockedUsers: [],
            blockedByUsers: [],
            errors: {
                friends: "Failed to load friends",
                blocked: "Failed to load blocked users",
                blockedBy: "Failed to load blocked by users",
            },
        };
    }
};
