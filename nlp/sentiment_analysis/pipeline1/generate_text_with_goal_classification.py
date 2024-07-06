import os
import sys
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline, DistilBertTokenizer, DistilBertForSequenceClassification

# Set the correct paths for the models
gpt2_model_path = os.path.join(os.path.dirname(__file__), '../../distilgpt2/gpt2-finetuned')
distilbert_model_path = os.path.join(os.path.dirname(__file__), 'distilbert-goal-finetuned')

# Ensure the paths are correct
print(f"GPT-2 model path: {os.path.abspath(gpt2_model_path)}")
print(f"DistilBERT model path: {os.path.abspath(distilbert_model_path)}")

# Load fine-tuned GPT-2 model
gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_path)
gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_path)

# Initialize the GPT-2 pipeline with your fine-tuned model
gpt2_generator = pipeline('text-generation', model=gpt2_model, tokenizer=gpt2_tokenizer)

# Load fine-tuned DistilBERT goal classifier
distilbert_tokenizer = DistilBertTokenizer.from_pretrained(distilbert_model_path)
distilbert_model = DistilBertForSequenceClassification.from_pretrained(distilbert_model_path)

# Initialize the DistilBERT pipeline for goal classification
goal_classifier = pipeline('text-classification', model=distilbert_model, tokenizer=distilbert_tokenizer, top_k=None)

# Define label mapping
label_mapping = {0: 'non-goal', 1: 'goal'}

# Generate text with goal classification
def generate_text_with_goal_classification(prompt):
    results = gpt2_generator(prompt, max_length=50, num_return_sequences=1, truncation=True)
    generated_text = results[0]['generated_text']
    
    classification = goal_classifier(generated_text)
    label = max(classification[0], key=lambda x: x['score'])['label']
    label_index = int(label.split('_')[-1])
    human_readable_label = label_mapping.get(label_index, "Unknown")

    return generated_text, human_readable_label

if len(sys.argv) > 1:
    prompt = sys.argv[1]
else:
    prompt = "Tell me about your goals."
    
generated_text, human_readable_label = generate_text_with_goal_classification(prompt)
print(f"Generated Text: {generated_text}")
print(f"Goal Classification: {human_readable_label}")