from firebase_functions import https_fn
from flask import jsonify, request, Flask
import traceback
import base64
import tempfile
import json
import os

# Import utility modules
from utilsfunctions import validate_request, get_cors_headers
from ai_services import translate_text, transcribe_audio

@https_fn.on_request(memory=1024, cpu=1, timeout_sec=540)
def translationService(request):
    """Process translation requests with actual audio data"""

    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        headers = get_cors_headers(request)
        return ('', 204, headers)
    
    # Get appropriate CORS headers
    headers = get_cors_headers(request)
    
    try:
        # Validate request
        is_valid, error_message = validate_request(request)
        if not is_valid:
            return jsonify({'error': error_message}), 400, headers
        
        raw_data = request.get_data()

        try:
            # Parse JSON
            if raw_data:
                data = json.loads(raw_data)
                
                # Extract the required fields
                source_language = data.get('sourceLanguage', 'en')
                target_language = data.get('targetLanguage', 'es')
                audio_base64 = data.get('audio', None)
                
                if not audio_base64:
                    return jsonify({'error': 'No audio data provided'}), 400, headers
                
                # Process the audio data
                try:
                    # Decode base64 to binary
                    audio_data = base64.b64decode(audio_base64.split(',')[1] if ',' in audio_base64 else audio_base64)
                    
                    # Create a temporary file
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_audio:
                        temp_audio.write(audio_data)
                        temp_audio_path = temp_audio.name
                    
                    try:
                        # Transcribe the audio
                        success, transcription = transcribe_audio(temp_audio_path, source_language)
                        if not success:
                            return jsonify({'error': f"Transcription error: {transcription}"}), 500, headers

                        # Translate the transcription
                        success, translated_text = translate_text(transcription, source_language, target_language)
                        if not success:
                            return jsonify({'error': f"Translation error: {translated_text}"}), 500, headers
                        
                        # Return successful response
                        return jsonify({
                            'originalText': transcription,
                            'translatedText': translated_text,
                            'status': 'Translation successful!'
                        }), 200, headers
                        
                    finally:
                        # Clean up the temporary file
                        if os.path.exists(temp_audio_path):
                            os.remove(temp_audio_path)
                            
                except Exception as e:
                    print(f"Audio processing error: {str(e)}")
                    return jsonify({'error': f"Audio processing error: {str(e)}"}), 500, headers
            else:
                return jsonify({'error': 'Empty request body'}), 400, headers
                
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            return jsonify({'error': f"Invalid JSON format: {str(e)}"}), 400, headers
            
    except Exception as e:
        error_message = str(e)
        stack_trace = traceback.format_exc()
        print(f"Error: {error_message}")
        print(stack_trace)
        return jsonify({'error': error_message}), 500, headers

@https_fn.on_request(memory=256)
def testCORS(request):
    """Simple function to test CORS configuration."""
    
    # Get appropriate CORS headers
    headers = get_cors_headers(request)
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return ('', 204, headers)
    
    try:
        return jsonify({
            'status': 'success',
            'message': 'CORS test function is working!',
            'requestMethod': request.method,
            'originReceived': request.headers.get('Origin', 'No origin in request')
        }), 200, headers
            
    except Exception as e:
        error_message = str(e)
        stack_trace = traceback.format_exc()
        print(f"Error: {error_message}")
        print(stack_trace)
        return jsonify({'error': error_message}), 500, headers

if __name__ == "__main__":
    # This block is only executed when the script is run directly
    # It's not used when deployed as a Firebase Function
    # But it helps with local testing

    app = Flask(__name__)
    
    # Forward requests to the Firebase Functions
    @app.route('/<path:path>', methods=['GET', 'POST', 'OPTIONS'])
    def forward(path):
        if path == 'translationService':
            return translationService(request)
        elif path == 'testCORS':
            return testCORS(request)
        else:
            return jsonify({'error': 'Unknown function'}), 404

    # Get port from environment variable or use 8080
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)