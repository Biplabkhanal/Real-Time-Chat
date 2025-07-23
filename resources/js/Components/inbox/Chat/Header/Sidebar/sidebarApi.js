import axios from "axios";

export const fetchConversationStats = async (userId) => {
    try {
        const response = await axios.get(`/conversation-stats/${userId}`);
        return { data: response.data, error: null };
    } catch (err) {
        console.error("Error fetching conversation stats:", err);
        return { data: null, error: "Failed to load conversation information" };
    }
};

export const fetchSharedMedia = async (userId, route) => {
    try {
        const response = await axios.get(route("messages.media", { userId }));
        return { data: response.data, error: null };
    } catch (error) {
        console.error("Error fetching shared media:", error);
        return {
            data: null,
            error:
                error.response?.data?.message || "Failed to load shared media",
        };
    }
};
