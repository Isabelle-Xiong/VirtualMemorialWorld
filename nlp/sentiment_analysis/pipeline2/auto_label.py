import pandas as pd
from transformers import pipeline

# Load the new data
data = pd.read_csv('new_goals.csv')

# Initialize sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Function to get sentiment labels
def get_sentiment(text):
    result = sentiment_analyzer(text)[0]
    label = result['label']
    score = result['score']
    return label, score

# Apply the sentiment analysis to the data
data[['Sentiment', 'Score']] = data['Goal'].apply(lambda x: pd.Series(get_sentiment(x)))

# Save the labeled data
data.to_csv('labeled_new_data.csv', index=False)