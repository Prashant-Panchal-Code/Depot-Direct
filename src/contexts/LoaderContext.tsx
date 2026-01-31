"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
    isLoading: boolean;
    loadingMessage: string;
    showLoader: (message?: string) => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    const showLoader = (message: string = 'Loading...') => {
        setLoadingMessage(message);
        setIsLoading(true);
    };

    const hideLoader = () => {
        setIsLoading(false);
        setLoadingMessage('Loading...');
    };

    return (
        <LoaderContext.Provider value={{ isLoading, loadingMessage, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}

export function useLoader() {
    const context = useContext(LoaderContext);
    if (context === undefined) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
}
