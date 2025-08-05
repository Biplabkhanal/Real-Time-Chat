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
