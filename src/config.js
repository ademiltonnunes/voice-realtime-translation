const isLocal = false;

const config = {
  functionUrl: isLocal
    ? 'http://127.0.0.1:5001/voice-realtime-translation/us-central1/translationService'
    : 'https://us-central1-voice-realtime-translation.cloudfunctions.net/translationService'
};

export default config;