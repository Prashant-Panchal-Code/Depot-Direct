"use client";

import { toast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Info, Warning } from "@phosphor-icons/react";

export function useNotification() {
    const showSuccess = (message: string, description?: string) => {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <CheckCircle size={20} weight="fill" className="text-green-600" />
                    <span>{message}</span>
                </div>
            ),
            description,
            variant: "default",
            className: "border-green-200 bg-green-50",
        });
    };

    const showError = (message: string, description?: string) => {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <XCircle size={20} weight="fill" className="text-red-600" />
                    <span>{message}</span>
                </div>
            ),
            description,
            variant: "destructive",
        });
    };

    const showInfo = (message: string, description?: string) => {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <Info size={20} weight="fill" className="text-blue-600" />
                    <span>{message}</span>
                </div>
            ),
            description,
            variant: "default",
            className: "border-blue-200 bg-blue-50",
        });
    };

    const showWarning = (message: string, description?: string) => {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <Warning size={20} weight="fill" className="text-yellow-600" />
                    <span>{message}</span>
                </div>
            ),
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
