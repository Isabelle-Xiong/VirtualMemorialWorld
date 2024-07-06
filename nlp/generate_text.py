import sys
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline

# Load fine-tuned model
model_path = "nlp/gpt2-finetuned"
tokenizer = GPT2Tokenizer.from_pretrained(model_path)
model = GPT2LMHeadModel.from_pretrained(model_path)

# Initialize the pipeline with your fine-tuned model
generator = pipeline('text-generation', model=model, tokenizer=tokenizer)

# Generate text
if len(sys.argv) > 1:
    prompt = sys.argv[1]
else:
    prompt = "Tell me about your goals."
    
results = generator(prompt, max_length=50, num_return_sequences=1)
for i, result in enumerate(results):
    print(f"Generated Text {i + 1}: {result['generated_text']}")