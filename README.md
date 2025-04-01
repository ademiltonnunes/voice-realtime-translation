# Healthcare Translation Web App

## Project Overview

This Healthcare Translation Web App is designed to facilitate real-time, multilingual communication between healthcare providers and patients. The application uses advanced AI to convert speech to text, provide live transcripts, and deliver accurate translations with audio playback capabilities.

Key features:
- Speech-to-text conversion with medical terminology recognition
- Real-time translation between multiple languages
- Audio playback of translated content
- Mobile-responsive interface with dual conversation displays
- Simple language selection interface

## Technology Stack

### Frontend
- React.js for the user interface
- Standard CSS for styling
- Web Speech API for browser-based speech recognition
- Browser SpeechSynthesis API for text-to-speech playback

### Backend
- Python with Firebase Cloud Functions
- OpenAI APIs for translation and transcription

### Deployment
- Firebase Hosting for the frontend
- Firebase Cloud Functions for the backend

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or newer)
- npm or yarn
- Python 3.12
- Firebase CLI (`npm install -g firebase-tools`)
- An OpenAI API key for the AI functionality

## Setup Instructions

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ademiltonnunes/voice-realtime-translation.git
   cd voice-realtime-translation
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   ```bash
   # Login to Firebase
   firebase login
   
   # Initialize Firebase
   firebase init
   ```
   
   During initialization:
   - Select Hosting and Functions
   - Choose an existing project or create a new one
   - For Functions, select Python
   - For Hosting, use "build" as your public directory
   - Configure as a single-page app: Yes

### Backend Configuration

1. Navigate to the functions directory:
   ```bash
   cd functions
   ```

2. Create and activate a virtual environment:
   ```bash
   # For Windows
   python -m venv venv
   .\venv\Scripts\Activate
   
   # For macOS/Linux
   python -m venv venv
     . venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the functions directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Set up your Firebase Functions configuration:
   ```bash
   firebase functions:config:set openai.apikey="your_api_key_here"
   ```

### Frontend Configuration

1. Create a `src/config.js` file with your function URLs:
   ```javascript
   const isLocal = false;

   const config = {
     functionUrl: isLocal
       ? 'http://localhost:5001/your-project-id/us-central1/translationService'
       : 'https://us-central1-your-project-id.cloudfunctions.net/translationService'
   };

   export default config;
   ```

   Replace `your-project-id` with your actual Firebase project ID.

## Development Workflow

### Running Locally

1. Start the Firebase emulators:
   ```bash
   firebase emulators:start
   ```

2. In a separate terminal, start the React development server:
   ```bash
   npm start
   ```

3. Access the application at `http://localhost:3000`

### Testing the Application

1. Select languages for both the provider and patient
2. Click "Start Conversation"
3. Use the "Speak" button on either side to record audio
4. Observe the transcription and translation process

## Deployment

### Deploy to Firebase

1. Build the React application:
   ```bash
   npm run build
   ```

2. If you're changing a function type (from callable to HTTP or vice versa), first delete the old function:
   ```bash
   firebase functions:delete functionName --region=us-central1
   ```

3. Deploy everything to Firebase:
   ```bash
   firebase deploy
   ```

4. Alternatively, deploy functions and hosting separately:
   ```bash
   firebase deploy --only functions
   firebase deploy --only hosting
   ```

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure your function has proper CORS headers in the backend code.

2. **Function URL mismatch**: Verify that the URL in your `config.js` matches the actual deployed function URL.

3. **Firebase Functions errors**: Check logs in the Firebase Console or using:
   ```bash
   firebase functions:log
   ```

4. **Microphone access denied**: Users must grant permission to access their microphone.

5. **OpenAI API errors**: Verify your API key is correctly set in both your local environment and Firebase config.

## Future Enhancements

- Add user authentication
- Implement persistent conversation history
- Add support for more languages
- Enhance medical terminology recognition
- Add visual indicators for speaking/listening states

## License

This project is licensed under the MIT License - see the LICENSE file for details.