import { memo } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import LoadingIcon from "./LoadingIcon";

const ActionButton = memo(
    ({
        type = "primary",
        onClick,
        disabled = false,
        isLoading = false,
        loadingText = "Loading...",
        children,
        icon: Icon,
        className = "",
        size = "md",
    }) => {
        const ButtonComponent =
            type === "danger" ? DangerButton : PrimaryButton;
        const sizeClasses = {
            sm: "text-xs px-2 py-1",
            md: "text-sm",
            lg: "text-base px-6 py-3",
        };

        return (
            <ButtonComponent
                onClick={onClick}
                disabled={disabled || isLoading}
                className={`${sizeClasses[size]} flex items-center justify-center ${className}`}
            >
                {isLoading ? (
                    <>
                        <LoadingIcon size="sm" className="mr-2" />
                        {loadingText}
                    </>
                ) : (
                    <>
                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                        {children}
                    </>
                )}
            </ButtonComponent>
        );
    }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
