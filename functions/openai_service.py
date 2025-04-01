import whisper
from openai import OpenAI
from dotenv import load_dotenv
import traceback
import os
import httpx

# OpenAI model configuration
OPENAI_MODELS = {
    'chat': 'gpt-3.5-turbo',
    'whisper': 'base', # Whisper model size: "base", "small", "medium", or "large"
}

def get_openai_api_key():
    """Retrieve OpenAI API key from Firebase config or environment variables."""
    try:
        # Try to get API key from Firebase Config for production
        from firebase_functions.params import get_param
        api_key = get_param("openai.apikey").value
        print("Using API key from Firebase config")
        return api_key
    except (ImportError, Exception):
        # Fallback to environment variables for local development
        try:
            
            load_dotenv()
        except ImportError:
            pass  # dotenv might not be installed

        api_key = os.getenv("OPENAI_API_KEY")

        if api_key:
            print("Using API key from environment variables")
        else:
            print("WARNING: No OpenAI API key found. Please set OPENAI_API_KEY in env or Firebase config.")
        
        return api_key

def initialize_openai():
    """Initialize OpenAI client correctly for openai>=1.3.0."""
    api_key = get_openai_api_key()

    if not api_key:
        raise ValueError("OpenAI API key is required but not found.")

    client = OpenAI(api_key=api_key, http_client=httpx.Client())

    return client

def generate_completion(system_prompt, user_prompts):
    """
    Generates a completion using OpenAI API.
    
    Args:
        system_prompt (str): The system role prompt.
        user_prompts (list): A list of user messages (str).
        model (str): OpenAI model to use.
    
    Returns:
        tuple: (success, response text or error message)
    """
    try:
        # Initialize OpenAI client 
        client = initialize_openai()

        if client is None:
            return True, f"Sample response (mocked due to missing client)."
        
        messages = [{"role": "system", "content": system_prompt}] + [
            {"role": "user", "content": prompt} for prompt in user_prompts
        ]
        
        response = client.chat.completions.create(
            model=OPENAI_MODELS['chat'],
            messages=messages
        )
        
        return True, response.choices[0].message.content.strip()
    
    except Exception as e:
        error_message = str(e)
        stack_trace = traceback.format_exc()
        print(f"Completion error: {error_message}")
        print(stack_trace)
        
        return False, f"Error occurred: {str(e)[:100]}"

def load_whisper_model():
    """
    Load the Whisper model for transcription.
    
    Returns:
        whisper model instance or None if loading fails.
    """
    try:
        model = whisper.load_model(OPENAI_MODELS['whisper'])
        print(f"Whisper model '{OPENAI_MODELS['whisper']}' loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading Whisper model: {e}")
        return None

def transcribe(audio_file_path, language):
    """
    Transcribe audio using a given Whisper model.
    
    Args:
        model: Loaded Whisper model instance.
        audio_file_path: Path to the audio file.
        language: Language code (e.g., 'en', 'es').
        
    Returns:
        tuple: (success, transcription or error message).
    """
    try:
        model = load_whisper_model()
        if model is None:
            return False, "Whisper model is not loaded."

        result = model.transcribe(audio_file_path, language=language)
        transcript = result["text"]
        
        print(f"Transcription successful: {transcript[:50]}...")
        return True, transcript
    except Exception as e:
        error_message = str(e)
        stack_trace = traceback.format_exc()
        print(f"Whisper transcription error: {error_message}")
        print(stack_trace)
        
        return False, f"Error occurred: {str(e)[:100]}"