import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccessControl } from '../../contexts/AccessControlContext';
import { AccessCodeDialog } from './AccessCodeDialog';

interface ProtectedRouteProps {
    pageId: string;
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ pageId, children }) => {
    const [showDialog, setShowDialog] = useState(true);
    const { accessStates } = useAccessControl();
    const location = useLocation();

    const currentState = accessStates[pageId];
    const isAuthenticated = currentState?.isAuthenticated;

    const handleClose = () => {
        setShowDialog(false);
        // 返回上一页
        window.history.back();
    };

    const handleSuccess = () => {
        setShowDialog(false);
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <>
            <AccessCodeDialog
                open={showDialog}
                pageId={pageId}
                onClose={handleClose}
                onSuccess={handleSuccess}
            />
            {!showDialog && <Navigate to="/" state={{ from: location }} replace />}
        </>
    );
}; 