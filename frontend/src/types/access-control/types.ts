export interface AccessCodeConfig {
    isAuthenticated: boolean;
    failedAttempts: number;
    lastAttemptTime?: number;
}

export interface AccessControlContextType {
    accessStates: Record<string, AccessCodeConfig>;
    verifyAccessCode: (pageId: string, code: string) => Promise<boolean>;
    resetAccessState: (pageId: string) => void;
} 