import React, { createContext, useContext, useState, useCallback } from 'react';

interface GuestSession {
    restaurantId: string;
    tableNumber: number;
    customerName: string;
    sessionToken: string;
    startedAt: string;
}

interface SessionContextType {
    session: GuestSession | null;
    isActive: boolean;
    startSession: (restaurantId: string, tableNumber: number, customerName: string) => void;
    endSession: () => void;
}

const SessionContext = createContext<SessionContextType>({
    session: null,
    isActive: false,
    startSession: () => {},
    endSession: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<GuestSession | null>(null);

    const startSession = useCallback((restaurantId: string, tableNumber: number, customerName: string) => {
        setSession({
            restaurantId,
            tableNumber,
            customerName,
            sessionToken: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            startedAt: new Date().toISOString(),
        });
    }, []);

    const endSession = useCallback(() => {
        setSession(null);
    }, []);

    return (
        <SessionContext.Provider value={{ session, isActive: !!session, startSession, endSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContextType {
    return useContext(SessionContext);
}
