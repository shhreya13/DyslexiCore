# ai_core/service_interface.py (Placeholder - Simulates ML model response)

from typing import Dict, Any

# Mock Model Load: Pretend to load a joblib or H5 model
def load_ml_model():
    """Placeholder for loading the trained AI model."""
    print("--- INFO: Loading Mock AI Recommendation Model ---")
    return True # Pretend the model is loaded

MODEL_LOADED = load_ml_model()

def get_ai_recommendation(data: Dict[str, float]) -> Dict[str, str]:
    """
    Simulates calling the AI model with assessment features.
    
    In a real app, this would use the loaded model (e.g., KNN or Classifier)
    to predict the 'dyslexia subtype' and recommend the best intervention.
    """
    
    # 1. Determine Risk Level based on scores
    # Example logic: if any score is below a threshold, risk is high
    risk_score = (data['phonological_score'] + data['naming_speed_score']) / 2.0
    
    if risk_score < 0.3:
        risk_level = "High"
        module = "Foundational-Phonics-Level-1"
        detail_msg = "Critical need for multisensory phonological awareness training."
    elif risk_score < 0.6:
        risk_level = "Moderate"
        module = "Decoding-Blends-Level-3"
        detail_msg = "Focus on decoding efficiency and rapid naming speed."
    else:
        risk_level = "Low"
        # Corrected module name to match MOCK_QUESTS
        module = "Syllable-Division-Level-5"
        detail_msg = "Continue practice; focus on fluency and comprehension strategies."
        
    return {
        "recommended_module_name": module,
        "risk_level": risk_level,
        "details": detail_msg
    }