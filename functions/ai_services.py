import traceback
from openai_service import generate_completion
# , load_whisper_model



def translate_text(text, source_lang, target_lang):
    """
    Translate text using OpenAI API with focus on medical terminology.
    
    Args:
        text: Text to translate
        source_lang: Source language code (e.g., 'en')
        target_lang: Target language code (e.g., 'es')
    
    Returns:
        tuple: (success, translated text or error message)
    """
    system_prompt = """You are a professional medical translator with expertise in healthcare terminology. 
    Translate the text accurately while preserving medical terms and maintaining the original meaning.
    Ensure proper context and cultural nuances are respected."""

    user_prompts = [f"Translate this text from {source_lang} to {target_lang}: {text}"]
    
    success, result = generate_completion(system_prompt, user_prompts)
    
    if success:
        return True, result
    else:
        return False, result


# Load Whisper model for transcription
# whisper_model = load_whisper_model()

# def transcribe_audio(audio_file_path, language):
#     """
#     Transcribe audio using local Whisper model
    
#     Args:
#         audio_file_path: Path to the audio file
#         language: Language code (e.g., 'en', 'es')
        
#     Returns:
#         tuple: (success, transcription or error message)
#     """
#     try:
#         print(f"Transcribing audio file: {audio_file_path}")
#         print(whisper_model)
        
#         if whisper_model is None:
#             return True, f"Sample transcription (Whisper model not loaded)"
        
#         # Transcribe the audio
#         # result = whisper_model.transcribe(audio_file_path, language=language)
#         result = {"text": "What is your name?"}
#         transcript = result["text"]
        
#         print(f"Transcription successful: {transcript[:50]}...")
#         return True, transcript
#     except Exception as e:
#         error_message = str(e)
#         stack_trace = traceback.format_exc()
#         print(f"Transcription error: {error_message}")
#         print(stack_trace)
        
#         # Provide a fallback for testing
#         return True, f"Sample transcription (Error occurred: {str(e)[:100]})"

# def translate_with_whisper(audio_file_path, source_language):
#     """
#     Translate audio directly to English using Whisper's translation capability
    
#     Args:
#         audio_file_path: Path to the audio file
#         source_language: Source language code (e.g., 'es', 'fr')
        
#     Returns:
#         tuple: (success, translation or error message)
#     """
#     try:
#         print(f"Translating audio directly with Whisper from {source_language} to English")
        
#         if whisper_model is None:
#             return True, f"Sample translation (Whisper model not loaded)"
        
#         # Translate the audio to English
#         result = whisper_model.transcribe(audio_file_path, language=source_language, task="translate")
#         translation = result["text"]
        
#         print(f"Direct translation successful: {translation[:50]}...")
#         return True, translation
#     except Exception as e:
#         error_message = str(e)
#         stack_trace = traceback.format_exc()
#         print(f"Direct translation error: {error_message}")
#         print(stack_trace)
        
#         # Provide a fallback for testing
#         return True, f"Sample translation (Error occurred: {str(e)[:100]})"
