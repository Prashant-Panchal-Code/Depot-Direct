"use client";

import { toast } from "@/components/ui/use-toast";

export function useNotification() {
    const showSuccess = (message: string, description?: string) => {
        toast({
            title: message,
            description,
            variant: "default",
            className: "border-green-200 bg-green-50",
        });
    };

    const showError = (message: string, description?: string) => {
        toast({
            title: message,
            description,
            variant: "destructive",
        });
    };

    const showInfo = (message: string, description?: string) => {
        toast({
            title: message,
            description,
            variant: "default",
            className: "border-blue-200 bg-blue-50",
        });
    };

    const showWarning = (message: string, description?: string) => {
        toast({
            title: message,
            description,
            variant: "default",
            className: "border-yellow-200 bg-yellow-50",
        });
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };
}
