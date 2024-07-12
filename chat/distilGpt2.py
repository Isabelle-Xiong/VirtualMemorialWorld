from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load the DistilGPT-2 model and tokenizer from Hugging Face
model_name = "distilgpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Force CPU usage
device = torch.device("cpu")
model.to(device)

def generate_response(prompt):
    inputs = tokenizer(prompt, return_tensors="pt")
    input_ids = inputs['input_ids'].to(device)
    attention_mask = inputs['attention_mask'].to(device)

    outputs = model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_length=100,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    print("Welcome to the DistilGPT-2 Chat! Type 'exit' to end the conversation.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        response = generate_response(user_input)
        print(f"Chatbot: {response}")