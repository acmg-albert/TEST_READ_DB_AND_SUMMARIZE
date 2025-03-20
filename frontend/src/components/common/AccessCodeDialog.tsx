import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';
import { useAccessControl } from '../../contexts/AccessControlContext';

interface AccessCodeDialogProps {
    open: boolean;
    pageId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const AccessCodeDialog: React.FC<AccessCodeDialogProps> = ({
    open,
    pageId,
    onClose,
    onSuccess
}) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { verifyAccessCode, accessStates } = useAccessControl();

    const currentState = accessStates[pageId] || { failedAttempts: 0 };
    const remainingAttempts = 3 - currentState.failedAttempts;

    const handleSubmit = async () => {
        if (!accessCode.trim()) {
            setError('Please enter access code');
            return;
        }

        const isValid = await verifyAccessCode(pageId, accessCode);
        if (isValid) {
            setAccessCode('');
            setError(null);
            onSuccess();
        } else {
            setError(`Invalid access code. Remaining attempts: ${remainingAttempts - 1}`);
            if (remainingAttempts <= 1) {
                setError('Maximum attempts reached. Please try again in 30 minutes');
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Access Verification</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter Access Code"
                        type="password"
                        fullWidth
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        error={!!error}
                        helperText={error}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                    {currentState.failedAttempts > 0 && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                            Remaining attempts: {remainingAttempts}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Verify
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 