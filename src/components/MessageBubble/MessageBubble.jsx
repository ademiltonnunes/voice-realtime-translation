// src/components/MessageBubble/MessageBubble.jsx
import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './styles';

const MessageBubble = ({ message, speakText, languageCode }) => {
const bubbleStyle = message.isTranslation ? styles.translationBubble : styles.originalBubble;

    return (
        <Box sx={{...styles.messageBubble, ...bubbleStyle}}>
            {message.type === 'audio' ? (
            <Box sx={styles.audioContainer}>
                <audio src={message.content} controls style={styles.audioPlayer} />
                {message.pending && <CircularProgress size={20} sx={styles.loadingIndicator} />}
            </Box>
            ) : (
            <Box sx={styles.textContainer}>
                <Typography>{message.content}</Typography>
                {message.isTranslation && (
                <Button 
                    startIcon={<VolumeUpIcon />} 
                    size="small" 
                    onClick={() => speakText(message.content, languageCode)}
                    sx={styles.speakButton}
                >
                    Speak
                </Button>
                )}
            </Box>
            )}
        </Box>
    );
};

export default MessageBubble;