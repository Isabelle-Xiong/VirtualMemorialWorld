import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
# Force CPU usage
torch.cuda.is_available = lambda: False
torch.backends.mps.is_available = lambda: False
device = torch.device("cpu")


def main():
    # Load the training and validation data
    train_data = pd.read_csv('nlp/sentiment_analysis/BERT_data/train_data.csv')
    val_data = pd.read_csv('nlp/sentiment_analysis/BERT_data/val_data.csv')

    # Load pre-trained model and tokenizer
    model_name = "bert-base-uncased"
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForSequenceClassification.from_pretrained(model_name, num_labels=3)  # POSITIVE, NEGATIVE, NEUTRAL

    # Tokenize data
    def tokenize_data(data):
        return tokenizer(data['Goal'].tolist(), padding=True, truncation=True, return_tensors="pt")

    train_encodings = tokenize_data(train_data)
    val_encodings = tokenize_data(val_data)

    class GoalDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item['labels'] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    # Create torch dataset
    train_dataset = GoalDataset(train_encodings, train_data['Sentiment'].tolist())
    val_dataset = GoalDataset(val_encodings, val_data['Sentiment'].tolist())

    # Define training arguments
    training_args = TrainingArguments(
        output_dir='./results',          # output directory
        num_train_epochs=3,              # number of training epochs
        per_device_train_batch_size=8,   # batch size for training
        per_device_eval_batch_size=16,   # batch size for evaluation
        warmup_steps=500,                # number of warmup steps for learning rate scheduler
        weight_decay=0.01,               # strength of weight decay
        logging_dir='./logs',            # directory for storing logs
        logging_steps=10,
    )

    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )

    # Train the model
    trainer.train()

    # Save the model and tokenizer
    trainer.save_model("./bert-finetuned")
    tokenizer.save_pretrained("./bert-finetuned")

if __name__ == "__main__":
    main()