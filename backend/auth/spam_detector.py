import joblib
import os

# Paths for models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "spam_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")

def get_spam_score(email):
    """
    Predicts the spam probability score for a given email string.
    Returns a float between 0 and 1.
    """
    try:
        # Check if models exist
        if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
            # Fallback or indicate model needs training
            return 0.0
            
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        
        email_vector = vectorizer.transform([email])
        # Predict probability of class 1 (spam)
        probability = model.predict_proba(email_vector)[0][1]
        return float(probability)
    except Exception as e:
        print(f"Error in spam detection: {e}")
        return 0.0
