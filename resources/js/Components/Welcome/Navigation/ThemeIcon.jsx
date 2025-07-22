import React from "react";

export function SunIcon(props) {
    return (
        <svg
            className={props.className || "w-6 h-6 mb-2"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    );
}

export function MoonIcon(props) {
    return (
        <svg
            className={props.className || "w-6 h-6 mb-2"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    );
}

export function ComputerIcon(props) {
    return (
        <svg
            className={props.className || "w-6 h-6 mb-2"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );
}

export default function ThemeIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={props.className || "h-5 w-5"}
            viewBox="0 0 20 20"
            fill="currentColor"
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
            />
        </svg>
    );
}
