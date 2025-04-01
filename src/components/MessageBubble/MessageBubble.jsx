import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './styles';

const MessageBubble = ({ message, speakText, languageCode }) => {
    const bubbleStyle = message.isTranslation ? styles.translationBubble : styles.originalBubble;

    return (
        <Box sx={{...styles.messageBubble, ...bubbleStyle}}>
            <Box sx={styles.textContainer}>
                <Typography>{message.content}</Typography>
                {/* Show audio player only if the message is not a translation and has an audio URL */}
                {!message.isTranslation && message.audioUrl && (
                    <Box sx={styles.audioContainer}>
                    <Typography variant="caption">Original Recording:</Typography>
                    <audio src={message.audioUrl} controls style={{height: '40px'}} />
                    </Box>
                )}
                
                {/* Show the speak button only if the message is a translation */}
                {message.isTranslation && (
                    <Button 
                    startIcon={<VolumeUpIcon />} 
                    size="small" 
                    onClick={() => speakText(message.content, languageCode)}
                    sx={{marginTop: '8px'}}
                    >
                    Speak
                    </Button>
                )}
                
                {message.pending && <CircularProgress size={20} sx={{marginLeft: '8px'}} />}
            </Box>
        </Box>
    );
};

export default MessageBubble;