import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useFilterUsers = (searchInput, users, setFilteredUsers) => {
    useEffect(() => {
        if (searchInput.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) =>
                user.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchInput, users]);
};

export const useMessageHandler = (selectedUserRef, inputRef) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [currentMessages, setCurrentMessages] = useState([]);

    const getMessages = useCallback(async () => {
        if (!selectedUserRef.current) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `/message/${selectedUserRef.current.id}`
            );
            setCurrentMessages(response.data);
        } catch (err) {
            setError("Failed to load messages. Please refresh the page.");
            console.error("Error fetching messages:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSendMessage = useCallback(async () => {
        if (messageInput.trim() === "" && attachments.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            await axios.post(`/message/${selectedUserRef.current.id}`, {
                message: messageInput,
                attachments: attachments,
            });

            // Reset form
            setMessageInput("");
            setAttachments([]);

            await getMessages();
            if (inputRef.current) inputRef.current.focus();

            toast.success("Message sent successfully");
        } catch (err) {
            setError("Failed to send message. Please try again.");
            console.error("Error sending message:", err);
            toast.error("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    }, [messageInput, attachments]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    return {
        isLoading,
        error,
        messageInput,
        setMessageInput,
        attachments,
        setAttachments,
        currentMessages,
        handleSendMessage,
        handleKeyDown,
        getMessages,
        setCurrentMessages,
    };
};
