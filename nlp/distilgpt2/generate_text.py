import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import os
import sys

# Force CPU usage
device = torch.device("cpu")

# Load tokenizer and model
gpt2_model_path = "./gpt2-finetuned"
tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_path)
model = GPT2LMHeadModel.from_pretrained(gpt2_model_path)
model = model.to(device)

# Generate text with structured template
prompt = sys.argv[1] if len(sys.argv) > 1 else "Tell me about your goals."
inputs = tokenizer.encode(prompt, return_tensors="pt").to(device)

# Generate text
with torch.no_grad():
    outputs = model.generate(
        inputs, 
        max_length=50, 
        num_return_sequences=1,
        do_sample=True, 
        top_k=50,
        top_p=0.95,
        attention_mask=torch.ones(inputs.shape, device=device)
    )

# Decode and print the generated text
generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(f"Generated text: {generated_text}")