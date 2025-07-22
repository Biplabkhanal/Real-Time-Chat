import React from "react";
import FeatureCard from "./FeatureCard";
import { GroupIcon, LockIcon, MessageIcon } from "../Icons/FeaturesIcon";

export default function FeaturesGrid() {
    const features = [
        {
            icon: (
                <MessageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            ),
            title: "Real-Time Messaging",
            description:
                "Send and receive messages instantly with our lightning-fast messaging system powered by WebSockets.",
        },
        {
            icon: (
                <GroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            ),
            title: "Group Chats",
            description:
                "Create group conversations with friends, family, or colleagues. Share files and collaborate efficiently.",
        },
        {
            icon: (
                <LockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            ),
            title: "Secure Communication",
            description:
                "End-to-end encryption ensures your conversations remain private and secure at all times.",
        },
    ];

    return (
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
    );
}
