/**
 * Toast Placeholder - Simple toast notifications
 * 
 * Basic toast component using shadcn/ui primitives as fallback.
 * TODO: Replace with site-wide toast system when available
 * TODO: Add proper positioning and animation
 * TODO: Integrate with global notification state
 */

'use client'

// Simple toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  duration?: number
}

// Simple toast implementation - replace with proper toast system
export const showToast = (message: string, type: ToastType = 'info', options?: ToastOptions) => {
  // For now, use console and basic alert as fallback
  // TODO: Implement proper toast notifications
  
  const prefix = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  }[type]

  console.log(`${prefix} ${message}`)

  // Temporary: Show as browser notification for demo
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(`${prefix} ${message}`)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(`${prefix} ${message}`)
        }
      })
    }
  }

  // Also create a temporary visual toast
  createVisualToast(message, type, options?.duration || 3000)
}

// Create a simple visual toast element
function createVisualToast(message: string, type: ToastType, duration: number) {
  const toast = document.createElement('div')
  
  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  }[type]

  toast.className = `fixed top-4 right-4 p-4 border-l-4 rounded shadow-lg z-50 max-w-sm ${bgColor}`
  toast.innerHTML = `
    <div class="flex">
      <div class="ml-3">
        <p class="text-sm font-medium">${message}</p>
      </div>
    </div>
  `

  document.body.appendChild(toast)

  // Remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, duration)

  // Add click to dismiss
  toast.addEventListener('click', () => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  })
}

// Toast Hook - for future use with proper toast system
export const useToast = () => {
  return {
    toast: showToast
  }
}

// TODO: Replace this entire file with proper toast system integration
// Example integration with shadcn/ui toast:
/*
import { toast } from "@/components/ui/use-toast"

export const showToast = (message: string, type: ToastType = 'info') => {
  toast({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: message,
    variant: type === 'error' ? 'destructive' : 'default'
  })
}
*/
