import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel, BertTokenizer, BertForSequenceClassification
import os
import sys

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Current directory: {current_dir}")

# Define the path to the fine-tuned GPT-2 model
gpt2_model_path = os.path.abspath(os.path.join(current_dir, "../../distilgpt2/gpt2-finetuned"))
print(f"GPT-2 model path: {gpt2_model_path}")

# Define the path to the fine-tuned BERT model
bert_model_path = os.path.abspath(os.path.join(current_dir, "../BERT/bert-finetuned"))
print(f"BERT model path: {bert_model_path}")

# Check if the path exists and list its contents
if not os.path.exists(gpt2_model_path):
    raise EnvironmentError(f"Path does not exist: {gpt2_model_path}")
else:
    print(f"Contents of {gpt2_model_path}: {os.listdir(gpt2_model_path)}")

if not os.path.exists(bert_model_path):
    raise EnvironmentError(f"Path does not exist: {bert_model_path}")
else:
    print(f"Contents of {bert_model_path}: {os.listdir(bert_model_path)}")

# Load the fine-tuned GPT-2 model and tokenizer
gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_path)
gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_path)
gpt2_model.eval()  # Set the model to evaluation mode

# Load the fine-tuned BERT model and tokenizer
bert_tokenizer = BertTokenizer.from_pretrained(bert_model_path)
bert_model = BertForSequenceClassification.from_pretrained(bert_model_path)
bert_model.eval()  # Set the model to evaluation mode

# Force CPU usage
device = torch.device("cpu")
gpt2_model.to(device)
bert_model.to(device)

# Generate text with sentiment
prompt = sys.argv[1] if len(sys.argv) > 1 else "Tell me about your goals."
inputs = gpt2_tokenizer.encode(prompt, return_tensors="pt").to(device)

# Generate text
with torch.no_grad():
    outputs = gpt2_model.generate(
        inputs, 
        max_length=50, 
        min_length=20,
        num_return_sequences=1,
        do_sample=True, 
        top_k=50,
        top_p=0.95,
        early_stopping=True,
        attention_mask=torch.ones(inputs.shape, device=device)
    )

# Decode the generated text
generated_text = gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)
generated_text = '. '.join(generated_text.split('. ')[:2])  # Limit to two sentences

# Ensure the text ends with a period
if not generated_text.endswith('.'):
    generated_text += '.'

# Classify the sentiment of the generated text using BERT
bert_inputs = bert_tokenizer(generated_text, return_tensors="pt", padding=True, truncation=True).to(device)
with torch.no_grad():
    sentiment_outputs = bert_model(**bert_inputs)
    sentiment_predictions = torch.argmax(sentiment_outputs.logits, dim=-1)

# Map numerical labels to sentiment
sentiment_mapping = {0: 'NEGATIVE', 1: 'NEUTRAL', 2: 'POSITIVE'}
predicted_sentiment = sentiment_mapping[sentiment_predictions.item()]

# Print the results
print(f"Generated text: {generated_text}")
print(f"Predicted sentiment: {predicted_sentiment}")