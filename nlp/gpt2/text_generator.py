import sys
from transformers import pipeline

# Initialize the Hugging Face pipeline
generator = pipeline('text-generation', model='gpt2')

# Check if a prompt argument is provided
if len(sys.argv) > 1:
    prompt = sys.argv[1]
else:
    prompt = "Tell me about the importance of education."

# Generate text based on the prompt
results = generator(prompt, max_length=50, num_return_sequences=1)

# Print the generated text
for i, result in enumerate(results):
    print(f"Generated Text {i + 1}: {result['generated_text']}")