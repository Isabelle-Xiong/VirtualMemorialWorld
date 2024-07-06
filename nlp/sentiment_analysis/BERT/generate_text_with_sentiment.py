import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import os
import sys

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

# Generate text with sentiment
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
        attention_mask=torch.ones(inputs.shape, device=device)
    )

# Decode and print the generated text
generated_text = gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)
print(f"Generated text: {generated_text}")