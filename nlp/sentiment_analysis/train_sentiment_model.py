# train_sentiment_model.py
from datasets import load_dataset, Dataset
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments

# Load dataset from CSV
dataset = load_dataset('csv', data_files={'train': 'sentiment_analysis/labeled_goals.csv'})

# Load tokenizer and model
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)  # Assuming 3 labels: NEGATIVE, NEUTRAL, POSITIVE

# Tokenize the data
def tokenize_function(examples):
    return tokenizer(examples['Goal'], padding='max_length', truncation=True)

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Define training arguments
training_args = TrainingArguments(
    output_dir='sentiment_analysis/BERT/results',
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
    train_dataset=tokenized_datasets['train'],
    eval_dataset=tokenized_datasets['train'],  # Use a separate validation set in practice
)

# Train the model
trainer.train()

# Save the model and tokenizer
trainer.save_model('sentiment_analysis/BERT/bert-finetuned')
tokenizer.save_pretrained('sentiment_analysis/BERT/bert-finetuned')