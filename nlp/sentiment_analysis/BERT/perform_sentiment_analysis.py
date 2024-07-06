import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import os

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Current directory: {current_dir}")

# Define the path to the fine-tuned model
model_path = os.path.join(current_dir, "bert-finetuned")
print(f"Model path: {model_path}")

# Check if the path exists and list its contents
if not os.path.exists(model_path):
    raise EnvironmentError(f"Path does not exist: {model_path}")
else:
    print(f"Contents of {model_path}: {os.listdir(model_path)}")

# Load the fine-tuned model and tokenizer
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval()  # Set the model to evaluation mode

# Force CPU usage
device = torch.device("cpu")
model.to(device)

# Example data for inference
data = ["This is a great day!", "I am not happy with the service.", "It's an average experience."]

# Tokenize the data
inputs = tokenizer(data, padding=True, truncation=True, return_tensors="pt")
inputs = {key: val.to(device) for key, val in inputs.items()}

# Perform inference
with torch.no_grad():
    outputs = model(**inputs)

# Get the predicted sentiment
predictions = torch.argmax(outputs.logits, dim=-1)

# Map numerical labels to sentiment
sentiment_mapping = {0: 'NEGATIVE', 1: 'NEUTRAL', 2: 'POSITIVE'}
predicted_sentiments = [sentiment_mapping[pred.item()] for pred in predictions]

# Print the results
for text, sentiment in zip(data, predicted_sentiments):
    print(f"Text: {text}\nSentiment: {sentiment}\n")