import os
import torch
import numpy as np
from datasets import load_dataset
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.preprocessing import LabelEncoder

# Force CPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = ""
os.environ["MPS_DEVICE"] = ""
torch.cuda.is_available = lambda: False
torch.backends.mps.is_available = lambda: False
device = torch.device("cpu")

# Load dataset from CSV
dataset = load_dataset('csv', data_files={'train': 'goal_classification_data.csv'})

# Print dataset info
print("Dataset Info:")
print(dataset)
print("\nColumn Names:", dataset['train'].column_names)
print("\nFirst few rows:")
print(dataset['train'][:5])

# Check if 'Label' column exists and is not empty
if 'Label' not in dataset['train'].column_names:
    raise ValueError("'Label' column not found in the dataset")

if len(dataset['train']['Label']) == 0:
    raise ValueError("'Label' column is empty")

# Remove rows with null labels and strip whitespace
def clean_labels(example):
    if example['Label'] is not None:
        example['Label'] = example['Label'].strip()
    return example

dataset = dataset.map(clean_labels)
dataset = dataset.filter(lambda example: example['Label'] is not None)

# Print unique labels
print("\nUnique labels:", set(dataset['train']['Label']))

# Load tokenizer and model
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=2)
model.to(device)

# Prepare label encoder
label_encoder = LabelEncoder()
label_encoder.fit(dataset['train']['Label'])

print("Encoded labels:", label_encoder.transform(['goal', 'non-goal']))

# Tokenize the data and add labels
def tokenize_and_add_labels(examples):
    tokenized = tokenizer(examples['Text'], padding='max_length', truncation=True, max_length=512)
    tokenized['labels'] = label_encoder.transform([examples['Label']])[0]  # Wrap in list and take first element
    return tokenized

tokenized_datasets = dataset['train'].map(tokenize_and_add_labels, remove_columns=dataset['train'].column_names)

# Convert to PyTorch tensors
tokenized_datasets.set_format(type='torch', columns=['input_ids', 'attention_mask', 'labels'])

# Define training arguments
training_args = TrainingArguments(
    output_dir='nlp/sentiment_analysis/pipeline1/goal_classification_results',
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets,
    eval_dataset=tokenized_datasets,  # Use a separate validation set in practice
)

# Train the model
trainer.train()

# Save the model and tokenizer
trainer.save_model("./distilbert-goal-finetuned")
tokenizer.save_pretrained("./distilbert-goal-finetuned")