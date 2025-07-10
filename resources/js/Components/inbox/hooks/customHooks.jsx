import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePage } from "@inertiajs/react";

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
    const { auth } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [currentMessages, setCurrentMessages] = useState([]);

    const getMessages = useCallback(
        async (onComplete, showLoading = true) => {
            if (!selectedUserRef.current) return;

            if (showLoading) {
                setIsLoading(true);
            }
            setError(null);

            try {
                const response = await axios.get(
                    `/message/${selectedUserRef.current.id}`
                );

                if (
                    JSON.stringify(response.data) !==
                    JSON.stringify(currentMessages)
                ) {
                    setCurrentMessages(response.data);

                    setTimeout(() => {
                        if (typeof window.scrollToBottom === "function") {
                            window.scrollToBottom();
                        }
                    }, 100);
                }
            } catch (err) {
                if (showLoading) {
                    setError(
                        "Failed to load messages. Please refresh the page."
                    );
                    console.error("Error fetching messages:", err);
                }
            } finally {
                if (showLoading) {
                    setIsLoading(false);
                }
                if (typeof onComplete === "function") {
                    onComplete();
                }
            }
        },
        [currentMessages]
    );

    const handleSendMessage = useCallback(async () => {
        if (messageInput.trim() === "" && attachments.length === 0) return;
        if (!selectedUserRef.current) return;

        const tempMessageId = `temp-${Date.now()}`;

        const tempMessage = {
            id: tempMessageId,
            message: messageInput,
            sender_id: auth.user.id,
            recipient_id: selectedUserRef.current.id,
            created_at: new Date().toISOString(),
            is_read: false,
            attachment:
                attachments.length > 0 ? JSON.stringify(attachments[0]) : null,
            _isOptimistic: true,
        };

        setCurrentMessages((prev) => [...prev, tempMessage]);

        const messageCopy = messageInput;
        const attachmentsCopy = [...attachments];
        setMessageInput("");
        setAttachments([]);
        if (inputRef.current) inputRef.current.focus();

        setIsSending(true);
        setError(null);

        try {
            const response = await axios.post(
                `/message/${selectedUserRef.current.id}`,
                {
                    message: messageCopy,
                    attachments: attachmentsCopy,
                }
            );

            if (response.data) {
                setCurrentMessages((prev) =>
                    prev
                        .filter((msg) => !msg._isOptimistic)
                        .concat(
                            Array.isArray(response.data)
                                ? response.data
                                : [response.data]
                        )
                );
            }
        } catch (err) {
            setCurrentMessages((prev) =>
                prev.filter((msg) => msg.id !== tempMessageId)
            );

            setError("Failed to send message. Please try again.");
            console.error("Error sending message:", err);
            toast.error("Failed to send message");
            setMessageInput(messageCopy);
            setAttachments(attachmentsCopy);
        } finally {
            setIsSending(false);
        }
    }, [messageInput, attachments, auth]);

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
        isSending,
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
