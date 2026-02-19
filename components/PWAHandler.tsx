"use client"

import { useEffect } from 'react'

export function PWAHandler() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            const registerServiceWorker = async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('SW registered:', registration);
                } catch (error) {
                    console.error('SW registration failed:', error);
                }
            };

            registerServiceWorker();
        }
    }, []);

    return null;
}
