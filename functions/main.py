from firebase_functions import https_fn
from flask import jsonify

# This function can be called directly with HTTP requests
@https_fn.on_request()
def testAndTranslate(request):
    """Simple test function that returns fixed text"""
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        # Check if this is a POST request with JSON data
        if request.method == 'POST' and request.is_json:
            data = request.get_json()
            source_language = data.get('sourceLanguage', 'en')
            target_language = data.get('targetLanguage', 'es')
            test_message = data.get('testMessage', 'Default test message')
        else:
            # For GET requests or non-JSON POST, use default values
            source_language = request.args.get('sourceLanguage', 'en')
            target_language = request.args.get('targetLanguage', 'es')
            test_message = request.args.get('testMessage', 'Default test message')
        
        # Create fake response
        original_text = f"Original test in {source_language}: {test_message}"
        
        # Create fake translation based on target language
        if target_language == 'es':
            translated_text = f"Prueba traducida en español: {test_message}"
        elif target_language == 'fr':
            translated_text = f"Test traduit en français: {test_message}"
        elif target_language == 'pt':
            translated_text = f"Teste traduzido em português: {test_message}"
        elif target_language == 'de':
            translated_text = f"Übersetzter Test auf Deutsch: {test_message}"
        else:
            translated_text = f"Translated test in {target_language}: {test_message}"
        
        # Return the test response
        return jsonify({
            'originalText': original_text,
            'translatedText': translated_text,
            'status': 'Test successful!'
        }), 200, headers
            
    except Exception as e:
        import traceback
        error_message = str(e)
        stack_trace = traceback.format_exc()
        print(f"Error: {error_message}")
        print(stack_trace)
        return jsonify({'error': error_message}), 500, headers