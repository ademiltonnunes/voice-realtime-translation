import traceback
from openai_service import generate_completion, transcribe

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

def transcribe_audio(audio_file_path, language):
    """
    Generic function to transcribe audio.
    
    Args:
        audio_file_path: Path to the audio file.
        language: Language code (e.g., 'en', 'es').
        
    Returns:
        tuple: (success, transcription or error message).
    """
    return transcribe(audio_file_path, language)
