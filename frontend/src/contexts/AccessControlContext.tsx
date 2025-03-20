import React, { createContext, useState, useContext, useCallback } from 'react';
import { AccessCodeConfig, AccessControlContextType } from '../types/access-control/types';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const AccessControlContext = createContext<AccessControlContextType | undefined>(undefined);

export const AccessControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessStates, setAccessStates] = useState<Record<string, AccessCodeConfig>>({});

    const verifyAccessCode = useCallback(async (pageId: string, code: string): Promise<boolean> => {
        const currentState = accessStates[pageId] || { isAuthenticated: false, failedAttempts: 0 };

        // Check if locked out
        if (currentState.failedAttempts >= MAX_ATTEMPTS && currentState.lastAttemptTime) {
            const timeSinceLastAttempt = Date.now() - currentState.lastAttemptTime;
            if (timeSinceLastAttempt < LOCKOUT_DURATION) {
                return false;
            }
        }

        // Verify access code using environment variable
        const validCode = process.env.REACT_APP_ACCESS_CODE;
        
        // For debugging purposes in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Debug - Environment variables:', {
                REACT_APP_ACCESS_CODE: process.env.REACT_APP_ACCESS_CODE,
                REACT_APP_API_URL: process.env.REACT_APP_API_URL,
                nodeEnv: process.env.NODE_ENV
            });
        }

        // Verify the code
        const isValid = Boolean(validCode && code.trim() === validCode.trim());

        setAccessStates(prev => ({
            ...prev,
            [pageId]: {
                isAuthenticated: isValid,
                failedAttempts: isValid ? 0 : (currentState.failedAttempts + 1),
                lastAttemptTime: isValid ? undefined : Date.now()
            } as AccessCodeConfig
        }));

        return isValid;
    }, [accessStates]);

    const resetAccessState = useCallback((pageId: string) => {
        setAccessStates(prev => ({
            ...prev,
            [pageId]: { isAuthenticated: false, failedAttempts: 0 }
        }));
    }, []);

    return (
        <AccessControlContext.Provider value={{ accessStates, verifyAccessCode, resetAccessState }}>
            {children}
        </AccessControlContext.Provider>
    );
};

export const useAccessControl = () => {
    const context = useContext(AccessControlContext);
    if (context === undefined) {
        throw new Error('useAccessControl must be used within an AccessControlProvider');
    }
    return context;
}; 