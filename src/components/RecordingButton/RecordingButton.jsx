import React from 'react';
import { Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import styles from './styles';

const RecordButton = ({ isRecording, onClick, disabled }) => {
    return (
        <Button
            variant="contained"
            color={isRecording ? "secondary" : "primary"}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={onClick}
            disabled={disabled}
            fullWidth
            sx={styles.button}
        >
            {isRecording ? "Stop" : "Speak"}
        </Button>
    );
};

export default RecordButton;