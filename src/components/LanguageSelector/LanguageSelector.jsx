import React from 'react';
import { 
    Paper, 
    Typography, 
    Box, 
    Button,
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem 
} from '@mui/material';
import { languageOptions } from '../../utils/languageUtils';
import styles from './styles';

const LanguageSelector = ({ 
    sourceLanguage, 
    targetLanguage, 
    onSourceChange, 
    onTargetChange,
    onStartConversation 
}) => {
    return (
        <Paper elevation={3} sx={styles.languageSelector}>
            <Typography variant="h6" gutterBottom>
            Select Languages
            </Typography>
            
            <Box sx={styles.languageInputs}>
            <FormControl fullWidth sx={styles.languageInput}>
                <InputLabel>Provider Language</InputLabel>
                <Select
                value={sourceLanguage}
                onChange={(e) => onSourceChange(e.target.value)}
                label="Provider Language"
                >
                {languageOptions.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            
            <FormControl fullWidth sx={styles.languageInput}>
                <InputLabel>Patient Language</InputLabel>
                <Select
                value={targetLanguage}
                onChange={(e) => onTargetChange(e.target.value)}
                label="Patient Language"
                >
                {languageOptions.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Box>
            
            <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            onClick={onStartConversation}
            sx={styles.startButton}
            >
            Start Conversation
            </Button>
        </Paper>
    );
};

export default LanguageSelector;