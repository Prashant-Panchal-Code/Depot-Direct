import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <span className="text-sm text-gray-600">{text}</span>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  text = 'Loading...', 
  className 
}) => {
  if (!isVisible) return null

  return (
    <div className={cn(
      'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-gray-700">{text}</p>
      </div>
    </div>
  )
}

interface PageLoadingProps {
  text?: string
}

export const PageLoading: React.FC<PageLoadingProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">{text}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner