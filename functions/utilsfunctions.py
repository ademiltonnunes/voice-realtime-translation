# Allowed origins for CORS
ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5001',
    'http://127.0.0.1:5001',
    'http://localhost:5000',
    'http://localhost:5002',
    'https://voice-realtime-translation.web.app',
    'https://voice-realtime-translation.firebaseapp.com'
]

def validate_request(request):
    """Validate the incoming request"""
    
    # Check if it's POST and has JSON data for main functionality
    if request.method == 'POST' and request.content_type != 'application/json':
        return False, "Expected JSON data for POST request"
    
    return True, ""

def get_cors_headers(request):
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
    }

# def get_cors_headers(request):
#     """Get appropriate CORS headers based on request origin"""
#     origin = request.headers.get('Origin', '')
#     if origin in ALLOWED_ORIGINS:
#         headers = {
#             'Access-Control-Allow-Origin': origin,
#             'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
#             'Access-Control-Allow-Headers': 'Content-Type',
#             'Access-Control-Max-Age': '3600'
#         }
#     else:
#         # Default to no CORS if origin not allowed
#         headers = {}
#     return headers