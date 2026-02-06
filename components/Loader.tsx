"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    fullScreen?: boolean;
}

export function Loader({
    className,
    size = "md",
    fullScreen = false
}: LoaderProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const loaderContent = (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Loader2
                    className={cn(
                        "animate-spin text-primary relative z-10",
                        sizeClasses[size]
                    )}
                />
            </div>

        </div>
    );

    if (fullScreen) {
        return (
            <div className="h-[50vh] flex items-center justify-center w-full">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
}
