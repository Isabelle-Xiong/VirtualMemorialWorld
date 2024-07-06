import os
import sys
from typing import Counter
import torch
import re
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline, DistilBertTokenizer, DistilBertForSequenceClassification
from safetensors.torch import load_file as load_safetensors
from nltk.util import ngrams


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
gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_path, state_dict=load_safetensors(os.path.join(gpt2_model_path, "model.safetensors")))
gpt2_model.eval()  # Set the model to evaluation mode

# Force CPU usage
device = torch.device("cpu")
gpt2_model.to(device)

# Define the path to the fine-tuned DistilBERT goal classifier model
goal_classifier_model_path = os.path.abspath(os.path.join(current_dir, "nlp/sentiment_analysis/pipeline1/distilbert-goal-finetuned"))
print(f"Goal Classifier model path: {goal_classifier_model_path}")

# Check if the path exists and list its contents
if not os.path.exists(goal_classifier_model_path):
    raise EnvironmentError(f"Path does not exist: {goal_classifier_model_path}")
else:
    print(f"Contents of {goal_classifier_model_path}: {os.listdir(goal_classifier_model_path)}")

# Load the fine-tuned DistilBERT model and tokenizer for goal classification
goal_classifier_tokenizer = DistilBertTokenizer.from_pretrained(goal_classifier_model_path)
goal_classifier_model = DistilBertForSequenceClassification.from_pretrained(goal_classifier_model_path)
goal_classifier_model.eval()  # Set the model to evaluation mode
goal_classifier_model.to(device)

# Initialize the BERT classification pipeline
goal_classifier = pipeline('text-classification', model=goal_classifier_model, tokenizer=goal_classifier_tokenizer, return_all_scores=True)

# Generate multiple goals
prompt = sys.argv[1] if len(sys.argv) > 1 else "Tell me about your goals."
inputs = gpt2_tokenizer.encode(prompt, return_tensors="pt").to(device)

# Generate multiple texts
num_return_sequences = 5
generated_texts = []
with torch.no_grad():
    outputs = gpt2_model.generate(
        inputs,
        max_length=50,
        num_return_sequences=num_return_sequences,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        attention_mask=torch.ones(inputs.shape, device=device)
    )
    for output in outputs:
        generated_text = gpt2_tokenizer.decode(output, skip_special_tokens=True)
        if re.match(r'^[A-Za-z0-9\s.,!?\'\"]*$', generated_text):  # Ensure text is in English
            generated_texts.append(generated_text)
        

# Function to count pronouns other than "I"
def count_other_pronouns(text):
    pronouns = re.findall(r'\b(he|she|it|they|we|you|his|her|its|their|our|your)\b', text, re.IGNORECASE)
    return len(pronouns)

# Function to count n-gram repetitions
def count_repetitions(text, n=3):
    words = text.split()
    n_grams = list(ngrams(words, n))
    n_gram_counts = Counter(n_grams)
    repetitions = sum(count - 1 for count in n_gram_counts.values() if count > 1)
    return repetitions
# Classify and select the best goal based on score and penalize other pronouns and repetitions
best_goal = None
best_goal_score = -1
penalty_factor_pronoun = 0.1  # Adjust this value to control the penalty strength for pronouns
penalty_factor_repetition = 0.05  # Adjust this value to control the penalty strength for repetitions

for text in generated_texts:
    classification_results = goal_classifier(text)
    goal_score = max(classification_results[0], key=lambda x: x['score'])['score']
    pronoun_penalty = count_other_pronouns(text) * penalty_factor_pronoun
    repetition_penalty = count_repetitions(text) * penalty_factor_repetition
    adjusted_goal_score = goal_score - pronoun_penalty - repetition_penalty
    
    if adjusted_goal_score > best_goal_score:
        best_goal = text
        best_goal_score = adjusted_goal_score

# Print the best goal
if best_goal:
    # Split the text at sentence-ending punctuation
    sentences = re.split(r'(?<=[.!?])\s+', best_goal)
    if len(sentences) >= 2:
        limited_goal = ' '.join(sentences[:2])
    else:
        limited_goal = best_goal  # If there's only one sentence or less, use the entire goal
    print(f"Best Goal (limited to 2 sentences): {limited_goal} | Adjusted Score: {best_goal_score:.4f}")
else:
    print("No suitable goal found.")