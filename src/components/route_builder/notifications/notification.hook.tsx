'use client'
import React from "react";
import { Notification } from "../types";

export function useNotifications() {
    // notifications
    const [isNotifying, setIsNotifying] = React.useState(false);
    const [notification, setNotification] = React.useState<Notification | null>(null);

    const notify = (notification: Notification) => {
        setNotification(notification);
        setIsNotifying(true);
        setTimeout(() => {
            setIsNotifying(false);
        }, 3000);
    }

    return {
        notification,
        isNotifying,
        notify,
    }
}