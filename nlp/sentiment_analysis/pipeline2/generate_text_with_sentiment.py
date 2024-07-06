import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline
import os
import sys
import re

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Current directory: {current_dir}")

# Define the path to the fine-tuned GPT-2 model
gpt2_model_path = os.path.abspath(os.path.join(current_dir, "../../distilgpt2/gpt2-finetuned"))
print(f"GPT-2 model path: {gpt2_model_path}")

# Check if the path exists and list its contents
if not os.path.exists(gpt2_model_path):
    raise EnvironmentError(f"Path does not exist: {gpt2_model_path}")
else:
    print(f"Contents of {gpt2_model_path}: {os.listdir(gpt2_model_path)}")

# Load the fine-tuned GPT-2 model and tokenizer
gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_path)
gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_path)
gpt2_model.eval()  # Set the model to evaluation mode

# Force CPU usage
device = torch.device("cpu")
gpt2_model.to(device)

# Load the pre-trained sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Function to generate text and analyze sentiment
def generate_and_analyze(prompt, num_return_sequences=5):
    inputs = gpt2_tokenizer.encode(prompt, return_tensors="pt").to(device)
    
    # Generate multiple outputs
    with torch.no_grad():
        outputs = gpt2_model.generate(
            inputs, 
            max_length=100,  # Increase length to ensure getting two sentences
            num_return_sequences=num_return_sequences,
            do_sample=True, 
            top_k=50,
            top_p=0.95,
            attention_mask=torch.ones(inputs.shape, device=device)
        )

    # Decode and analyze sentiment
    generated_texts = [gpt2_tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
    sentiments = [sentiment_analyzer(text)[0] for text in generated_texts]

    return generated_texts, sentiments

# Function to extract the first two sentences
def extract_first_two_sentences(text):
    sentences = re.split(r'(?<=[.!?]) +', text)
    return ' '.join(sentences[:2])

# Main function to generate and select the most positive text
def main(prompt):
    generated_texts, sentiments = generate_and_analyze(prompt)
    
    # Extract the first two sentences from each generated text
    two_sentence_texts = [extract_first_two_sentences(text) for text in generated_texts]
    
    # Re-analyze sentiment for truncated texts
    truncated_sentiments = [sentiment_analyzer(text)[0] for text in two_sentence_texts]
    
    # Find the most positive text
    positive_text = max(zip(two_sentence_texts, truncated_sentiments), key=lambda x: x[1]['score'] if x[1]['label'] == 'POSITIVE' else -1)
    
    return positive_text

if __name__ == "__main__":
    prompt = sys.argv[1] if len(sys.argv) > 1 else "Tell me about your goals."
    generated_text, sentiment = main(prompt)
    print(f"Generated text: {generated_text}")
    print(f"Sentiment: {sentiment['label']}, Score: {sentiment['score']}")