import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import os

def train_basic_model():
    """Trains a very basic model for demonstration purposes."""
    # Sample data: common spam keywords vs normal emails
    data = {
        'text': [
            'support@google.com', 'contact@amazon.com', 'hello@github.com',
            'free-offer-123@win-prizes.com', 'win-cash-now@spam-mail.top', 
            'account-update@bank.com', 'urgent-action-required@fake-security.xyz',
            'john.doe@gmail.com', 'jane.smith@outlook.com', 'spam-bot-1@bad-actor.net',
            'winner.claiming.prize@lottery-winner.online', 'official.newsletter@tech-hub.io',
            'get-rich-quick@money-maker.biz', 'exclusive-deal@discount-offers.com',
            'verify-your-account-now@secure-login-attempt.info', 'admin@agrotech-ai.com',
            'customer-service@paypal.com', 'lottery-win-1000@lucky-draw.com'
        ],
        'label': [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1] # 0 = Safe, 1 = Suspicious
    }
    
    df = pd.DataFrame(data)
    
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(df['text'])
    y = df['label']
    
    model = LogisticRegression()
    model.fit(X, y)
    
    # Save the model
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "models")
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        
    joblib.dump(model, os.path.join(models_dir, "spam_model.pkl"))
    joblib.dump(vectorizer, os.path.join(models_dir, "vectorizer.pkl"))
    print("Model and vectorizer saved successfully.")

if __name__ == "__main__":
    train_basic_model()
