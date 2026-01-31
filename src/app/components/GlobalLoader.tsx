"use client";

import { useLoader } from '@/contexts/LoaderContext';
import { CircleNotch } from '@phosphor-icons/react';

export default function GlobalLoader() {
    const { isLoading, loadingMessage } = useLoader();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative">
                {/* Animated background glow */}
                <div className="absolute inset-0 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-full"></div>
                </div>

                {/* Loader card */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 min-w-[300px]">
                    {/* Spinning icon */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            {/* Outer ring */}
                            <div className="absolute inset-0 animate-spin">
                                <div className="w-20 h-20 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full"></div>
                            </div>

                            {/* Middle ring */}
                            <div className="absolute inset-2 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}>
                                <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full"></div>
                            </div>

                            {/* Center icon */}
                            <div className="relative flex items-center justify-center w-20 h-20">
                                <CircleNotch size={32} weight="bold" className="text-blue-600 animate-spin" />
                            </div>
                        </div>

                        {/* Loading text */}
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {loadingMessage}
                            </h3>
                            <div className="flex items-center justify-center space-x-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
