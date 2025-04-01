import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import MessageBubble from '../MessageBubble';
import RecordButton from '../RecordingButton';
import { getLanguageName } from '../../utils/languageUtils';
import styles from './styles';

const ConversationSpace = ({ 
    languageCode, 
    messages, 
    isRecording, 
    isProcessing, 
    otherSideRecording,
    onRecordClick,
    speakText
    }) => {
    return (
        <Paper 
            elevation={3} 
            sx={styles.conversationSpace}
        >
            <Typography variant="h6" sx={styles.languageHeader}>
            {getLanguageName(languageCode)}
            </Typography>
            
            <Box sx={styles.messagesContainer}>
            {messages.map((message, index) => (
                <MessageBubble 
                key={index} 
                message={message}
                speakText={speakText}
                languageCode={languageCode}
                />
            ))}
            </Box>
            
            <RecordButton 
            isRecording={isRecording}
            onClick={onRecordClick}
            disabled={otherSideRecording || isProcessing}
            />
        </Paper>
    );
};

export default ConversationSpace;