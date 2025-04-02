const isLocal = false;

const config = {
  functionUrl: isLocal
    ? 'http://127.0.0.1:5001/voice-realtime-translation/us-central1/translationService'
    : 'https://translationservice-qn3ezec6tq-uc.a.run.app'
};

export default config;