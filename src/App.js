import React, { useState, useRef } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import LanguageSelector from './components/LanguageSelector';
import ConversationSpace from './components/ConversationSpace';
import './App.css';
import config from './config';

function App() {
  // Language selection state
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [languagesSelected, setLanguagesSelected] = useState(false);
  
  // Recording variables
  const [activeRecorder, setActiveRecorder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
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
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => handleAudioData(side);
        
        mediaRecorder.start();
        setActiveRecorder(side);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
      });
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && activeRecorder) {
      mediaRecorderRef.current.stop();
      // The onStop event handler will call handleAudioData
    }
  };
  
  // Process audio data using HTTP function
  const handleAudioData = async (side) => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Set a pending message for UI feedback with audio URL
    if (side === 'source') {
      setSourceMessages(prev => [...prev, { 
        type: 'text', 
        content: 'Recording received, processing...',
        pending: true,
        audioUrl: audioUrl
      }]);
    } else {
      setTargetMessages(prev => [...prev, { 
        type: 'text', 
        content: 'Recording received, processing...',
        pending: true,
        audioUrl: audioUrl
      }]);
    }
    
    try {
      // Convert the audio blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      console.log(`Audio data size: ${base64Audio.length} bytes`);
      // If it's very large (over a few MB), we might need to chunk it
      if (base64Audio.length > 5000000) {  // 5MB threshold
        console.warn("Audio data is very large and might exceed request limits");
      }
      
      // Send the actual audio data to the function
      const response = await fetch(config.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
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
        // Update the original side with transcription
        if (side === 'source') {
          setSourceMessages(prev => 
            prev.map((msg, i) => 
              i === prev.length - 1 ? { 
                type: 'text', 
                content: data.originalText, 
                pending: false, 
                audioUrl: msg.audioUrl // Preserve the audio URL
              } : msg
            )
          );
          
          // Add the translated text to target side
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
                pending: false,
                audioUrl: msg.audioUrl // Preserve the audio URL
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

  // Helper function to convert Blob to Base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
      
      <Grid container spacing={2} sx={{ 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch'
      }}>
        {/* Source language side */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
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
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
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