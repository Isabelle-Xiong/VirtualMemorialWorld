import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Load the labeled data
data_dir = os.path.abspath('../sentiment_analysis')  
data_file = os.path.join(data_dir, 'labeled_goals.csv')
data = pd.read_csv(data_file)

# Map sentiment labels to numerical values
sentiment_mapping = {'NEGATIVE': 0, 'NEUTRAL': 1, 'POSITIVE': 2}
data['Sentiment'] = data['Sentiment'].map(sentiment_mapping)

# Split the data into training and validation sets
train_data, val_data = train_test_split(data, test_size=0.1, random_state=42)

# Ensure the directory exists
output_dir = os.path.abspath('nlp/sentiment_analysis/BERT')
os.makedirs(output_dir, exist_ok=True)

# Save the splits for later use
train_data.to_csv(os.path.join(output_dir, 'train_data.csv'), index=False)
val_data.to_csv(os.path.join(output_dir, 'val_data.csv'), index=False)