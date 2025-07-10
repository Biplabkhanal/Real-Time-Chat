import React from "react";

export default function FeatureCard({ icon, title, description }) {
    return (
        <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-200 transition duration-300 hover:shadow-xl lg:p-8 dark:bg-gray-800 dark:ring-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
}
