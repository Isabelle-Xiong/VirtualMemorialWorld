from transformers import pipeline
import csv

# Load pre-trained sentiment-analysis model
classifier = pipeline('sentiment-analysis')

# Read input file
with open('goals.txt', 'r') as file:
    goals = file.readlines()

# Perform sentiment analysis
results = classifier(goals)

# Save results to a CSV file
with open('labeled_goals.csv', 'w', newline='') as csvfile:
    fieldnames = ['Goal', 'Label', 'Score']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for goal, result in zip(goals, results):
        writer.writerow({'Goal': goal.strip(), 'Label': result['label'], 'Score': result['score']})

print("Labeling complete. Results saved to labeled_goals.csv")