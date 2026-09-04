// src/components/TokenNotification.jsx
import React, { useState, useEffect } from 'react';
import { checkTokenTurn } from '../services/notificationService';

export default function TokenNotification({ queuePosition }) {
    const [notification, setNotification] = useState(null);
    const [hasNotified, setHasNotified] = useState(false);

    useEffect(() => {
        const result = checkTokenTurn(queuePosition, 3);

        if (result.shouldNotify && !hasNotified) {
            setNotification(result.message);
            setHasNotified(true); // Prevents repeated spamming
        }
    }, [queuePosition, hasNotified]);

    if (!notification) return null;

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded shadow-md" role="alert">
            <p className="font-bold">Token Alert</p>
            <p>{notification}</p>
            <button
                onClick={() => setNotification(null)}
                className="mt-2 text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
                Dismiss
            </button>
        </div>
    );
}