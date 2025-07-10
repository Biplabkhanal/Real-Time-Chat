import { useEffect, useState } from "react";

export default function Notifications({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();
        window.Echo.private(`user.${user.id}`).listen(
            "FriendRequestReceived",
            (e) => {
                const newNotification = {
                    id: `temp-${Date.now()}`,
                    sender: e.sender,
                    content: "sent you a friend request",
                    created_at: new Date().toISOString(),
                    type: "friend_request_received",
                    is_read: false,
                };

                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prevCount) => prevCount + 1);

                setTimeout(fetchNotifications, 1000);
            }
        );

        window.Echo.private(`user.${user.id}`).listen(
            "FriendRequestAccepted",
            (e) => {
                const newNotification = {
                    id: `temp-${Date.now()}`,
                    sender: e.accepter,
                    content: "accepted your friend request",
                    created_at: new Date().toISOString(),
                    type: "friend_request_accepted",
                    is_read: false,
                };

                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prevCount) => prevCount + 1);

                setTimeout(fetchNotifications, 1000);
            }
        );

        return () => {
            window.Echo.leave(`message.${user.id}`);
            window.Echo.leave(`user.${user.id}`);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route("notifications.index"));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId, event) => {
        if (event) {
            event.stopPropagation();
        }

        try {
            await axios.post(
                route("notifications.markAsRead", { id: notificationId })
            );
            setNotifications(
                notifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route("notifications.markAllAsRead"));
            setNotifications(
                notifications.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showNotifications &&
                !event.target.closest(".notification-container")
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotifications]);

    const handleNotificationClick = (notification) => {
        // Handle notification click if needed
    };

    return {
        notifications,
        unreadCount,
        showNotifications,
        markAsRead,
        markAllAsRead,
        toggleNotifications,
        handleNotificationClick,
    };
}
