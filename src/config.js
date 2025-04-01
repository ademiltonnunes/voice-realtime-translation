// src/config.js
const isLocal = false; // Set to true for local development

const config = {
  functionUrl: isLocal
    ? 'http://localhost:5001/voice-realtime-translation/us-central1/testAndTranslate'
    : 'https://us-central1-voice-realtime-translation.cloudfunctions.net/testAndTranslate'
};

export default config;