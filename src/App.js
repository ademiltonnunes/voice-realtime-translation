import React, { useState, useRef } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import LanguageSelector from './components/LanguageSelector';
import ConversationSpace from './components/ConversationSpace';
import './App.css';
import config from './config';

function App() {
  // Language selection state
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [languagesSelected, setLanguagesSelected] = useState(false);
  
  // Recording state
  const [activeRecorder, setActiveRecorder] = useState(null); // 'source' or 'target'
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Conversation history
  const [sourceMessages, setSourceMessages] = useState([]);
  const [targetMessages, setTargetMessages] = useState([]);
  
  // Start language selection
  const handleStartConversation = () => {
    if (sourceLanguage && targetLanguage) {
      setLanguagesSelected(true);
    } else {
      alert('Please select both languages');
    }
  };
  
  // Test recording (simplified)
  const startRecording = (side) => {
    if (isProcessing) return;
    
    setActiveRecorder(side);
    // Simulate recording for 1 second then auto-stop
    setTimeout(() => {
      stopRecording();
    }, 1000);
  };
  
  // Stop recording
  const stopRecording = () => {
    if (activeRecorder) {
      handleAudioData(activeRecorder);
    }
  };
  
  // Process audio data using HTTP function
  const handleAudioData = async (side) => {
    // Set a pending message for UI feedback
    if (side === 'source') {
      setSourceMessages(prev => [...prev, { 
        type: 'text', 
        content: 'Recording received, sending to server...',
        pending: true
      }]);
    } else {
      setTargetMessages(prev => [...prev, { 
        type: 'text', 
        content: 'Recording received, sending to server...',
        pending: true
      }]);
    }
    
    try {
      const response = await fetch(config.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMessage: "This is a test message",
          sourceLanguage: side === 'source' ? sourceLanguage : targetLanguage,
          targetLanguage: side === 'source' ? targetLanguage : sourceLanguage
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Function response:", data);
      
      // Update UI with response
      if (data.originalText && data.translatedText) {
        // Update the source side with test text
        if (side === 'source') {
          setSourceMessages(prev => 
            prev.map((msg, i) => 
              i === prev.length - 1 ? { 
                type: 'text', 
                content: data.originalText, 
                pending: false 
              } : msg
            )
          );
          
          // Add the translated test text to target side
          setTargetMessages(prev => [...prev, { 
            type: 'text', 
            content: data.translatedText,
            isTranslation: true
          }]);
        } else {
          // Same for target side
          setTargetMessages(prev => 
            prev.map((msg, i) => 
              i === prev.length - 1 ? { 
                type: 'text', 
                content: data.originalText, 
                pending: false 
              } : msg
            )
          );
          
          setSourceMessages(prev => [...prev, { 
            type: 'text', 
            content: data.translatedText,
            isTranslation: true
          }]);
        }
      }
    } catch (error) {
      console.error('Error calling function:', error);
      alert(`Error: ${error.message}`);
      
      // Remove the pending message
      if (side === 'source') {
        setSourceMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
      } else {
        setTargetMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
      }
    } finally {
      setIsProcessing(false);
      setActiveRecorder(null);
    }
  };
  
  // Play translated text as speech
  const speakText = (text, langCode) => {
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  };
  
  // Handle record button click
  const handleRecordButtonClick = (side) => {
    if (activeRecorder === side) {
      stopRecording();
    } else {
      startRecording(side);
    }
  };
  
  // Render language selection screen
  if (!languagesSelected) {
    return (
      <Container maxWidth="sm" className="app-container">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Healthcare Translator
        </Typography>
        
        <LanguageSelector 
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSourceChange={setSourceLanguage}
          onTargetChange={setTargetLanguage}
          onStartConversation={handleStartConversation}
        />
      </Container>
    );
  }
  
  // Render conversation interface
  return (
    <Container maxWidth="lg" className="app-container">
      <Typography variant="h4" component="h1" gutterBottom align="center" className="app-title">
        Healthcare Translator
      </Typography>
      
      <Grid container spacing={2}>
        {/* Source language side */}
        <Grid item xs={12} md={6}>
          <ConversationSpace 
            languageCode={sourceLanguage}
            messages={sourceMessages}
            isRecording={activeRecorder === 'source'}
            isProcessing={isProcessing}
            otherSideRecording={activeRecorder === 'target'}
            onRecordClick={() => handleRecordButtonClick('source')}
            speakText={speakText}
          />
        </Grid>
        
        {/* Target language side */}
        <Grid item xs={12} md={6}>
          <ConversationSpace 
            languageCode={targetLanguage}
            messages={targetMessages}
            isRecording={activeRecorder === 'target'}
            isProcessing={isProcessing}
            otherSideRecording={activeRecorder === 'source'}
            onRecordClick={() => handleRecordButtonClick('target')}
            speakText={speakText}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;