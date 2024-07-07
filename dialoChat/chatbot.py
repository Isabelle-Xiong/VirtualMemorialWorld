# dialoChat/chatbot.py
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import torch

# Load the tokenizer and model from Hugging Face
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

# Force CPU usage
device = torch.device("cpu")
model.to(device)

def generate_response(prompt):
    inputs = tokenizer.encode(prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        inputs,
        max_length=100,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        attention_mask=torch.ones(inputs.shape, device=device)
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    print("Welcome to the DialoChat! Type 'exit' to end the conversation.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        response = generate_response(user_input)
        print(f"Chatbot: {response}")