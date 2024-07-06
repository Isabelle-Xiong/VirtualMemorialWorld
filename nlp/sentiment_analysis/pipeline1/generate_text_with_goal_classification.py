import os
import sys
import torch
import re
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline
from safetensors.torch import load_file as load_safetensors
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline, DistilBertTokenizer, DistilBertForSequenceClassification

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

# Generate text with goal classification
prompt = sys.argv[1] if len(sys.argv) > 1 else "Tell me about your goals."
inputs = gpt2_tokenizer.encode(prompt, return_tensors="pt").to(device)

# Generate text
with torch.no_grad():
    outputs = gpt2_model.generate(
        inputs,
        max_length=50,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7,  # Adjusted temperature for more coherent text
        repetition_penalty=2.0,  # Penalize repetitions to improve diversity
        attention_mask=torch.ones(inputs.shape, device=device)
    )

# Decode and print the generated text
generated_text = gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)
print(f"Generated text: {generated_text}")

# Clean the generated text
def clean_text(text):
    text = re.sub(r"<[^>]*>", "", text)  # Remove HTML-like tags
    text = re.sub(r"\[.*?\]", "", text)  # Remove content inside square brackets
    text = re.sub(r"[^\w\s.,!?']", "", text)  # Remove any other unwanted characters
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra whitespace
    return text

cleaned_text = clean_text(generated_text)

# Define the path to the fine-tuned DistilBERT goal classifier model
bert_model_path = os.path.abspath(os.path.join(current_dir, "nlp/sentiment_analysis/pipeline1/distilbert-goal-finetuned"))
print(f"BERT model path: {bert_model_path}")

# Check if the path exists and list its contents
if not os.path.exists(bert_model_path):
    raise EnvironmentError(f"Path does not exist: {bert_model_path}")
else:
    print(f"Contents of {bert_model_path}: {os.listdir(bert_model_path)}")

# Load the fine-tuned DistilBERT model and tokenizer
bert_tokenizer = DistilBertTokenizer.from_pretrained(bert_model_path)
bert_model = DistilBertForSequenceClassification.from_pretrained(bert_model_path)
bert_model.eval()  # Set the model to evaluation mode
bert_model.to(device)

# Initialize the BERT classification pipeline
bert_classifier = pipeline('text-classification', model=bert_model, tokenizer=bert_tokenizer, return_all_scores=True)

# Map labels to more meaningful names
label_map = {0: 'non-goal', 1: 'goal'}

# Classify the generated text
classification_results = bert_classifier(cleaned_text)
goal_label = max(classification_results[0], key=lambda x: x['score'])
goal_label_name = label_map[int(goal_label['label'].split('_')[-1])]
print(f"Goal Classification: {goal_label_name}, Score: {goal_label['score']:.4f}")