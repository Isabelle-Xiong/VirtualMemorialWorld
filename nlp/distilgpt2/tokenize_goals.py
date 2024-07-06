import spacy

nlp = spacy.load("en_core_web_sm")

def preprocess_goal(goal):
    doc = nlp(goal)
    tokens = []
    for token in doc:
        if token.dep_ in {"nsubj", "nsubjpass"}:  # pronouns (subject)
            tokens.append("<PRONOUN> " + token.text + " </PRONOUN>")
        elif token.pos_ == "VERB":  # verbs
            tokens.append("<VERB> " + token.text + " </VERB>")
        elif token.dep_ in {"dobj", "pobj", "attr"}:  # direct objects, prepositional objects, attributes
            tokens.append("<OBJECT> " + token.text + " </OBJECT>")
        else:
            tokens.append(token.text)
    return " ".join(tokens)

# Load and preprocess goals
with open("goals.txt", "r") as file:
    raw_goals = file.readlines()

preprocessed_goals = [preprocess_goal(goal.strip()) for goal in raw_goals]

# Save the preprocessed goals to a new file
with open("cleaned_goals.txt", "w") as file:
    for goal in preprocessed_goals:
        file.write(goal + "\n")