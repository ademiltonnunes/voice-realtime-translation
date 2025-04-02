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

@https_fn.on_request(memory=4096, cpu=1, timeout_sec=540)
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
                print(f"Received audio data: {audio_base64}")
                
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
                        
                        # transcription = 'hello'

                        # Translate the transcription
                        success, translated_text = translate_text(transcription, source_language, target_language)
                        if not success:
                            return jsonify({'error': f"Translation error: {translated_text}"}), 500, headers
                        
                        # translated_text = 'Ola'
                        
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
