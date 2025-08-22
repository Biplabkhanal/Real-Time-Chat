import { memo } from "react";

export const VerticalDotsIcon = memo(({ className = "" }) => (
    <svg
        className={className || "h-6 w-6"}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
));

export const CancelIcon = memo(({ className = "" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
));

export const CheckIcon = memo(({ className = "" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
        />
    </svg>
));

export const ShareIcon = memo(({ className = "" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15 8l5-5m0 0l-5-5m5 5H9a6 6 0 00-6 6v7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
));

export const LikeIcon = memo(({ className = "" }) => (
    <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M3.172 5.172a4.001 4.001 0 015.656 0L10 6.343l1.172-1.171a4.001 4.001 0 115.656 5.656L10 17.657l-6.828-6.829a4.001 4.001 0 010-5.656z" />
    </svg>
));

export const ChatIcon = memo(({ className = "" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
    </svg>
));

export const CommentIcon = memo(({ className = "" }) => (
    <svg
        className="w-12 h-12 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <rect x="4" y="4" width="16" height="16" rx="2" fill="#e5e7eb" />
        <rect x="8" y="8" width="8" height="4" rx="1" fill="#9ca3af" />
    </svg>
));
