import spacy

nlp = spacy.load("en_core_web_sm")

def preprocess_goal(goal):
    doc = nlp(goal)
    tokens = []
    for token in doc:
        if token.dep_ in {"nsubj", "nsubjpass"}:  # pronouns (subject)
            tokens.append("<PRONOUN> " + token.text + " </PRONOUN>")
        elif token.dep_ == "ROOT":  # main verb
            tokens.append("<ACTION> " + token.text + " </ACTION>")
        elif token.dep_ in {"dobj", "attr", "prep"}:  # direct objects, attributes, prepositional objects
            tokens.append("<OBJECT> " + token.text + " </OBJECT>")
        elif token.dep_ == "advmod":  # adverbs (modifiers)
            tokens.append("<ADVERB> " + token.text + " </ADVERB>")
        elif token.dep_ == "prep":  # prepositions
            tokens.append("<PREPOSITION> " + token.text + " </PREPOSITION>")
        else:
            tokens.append("<OTHER> " + token.text + " </OTHER>")
    return " ".join(tokens)

# Load and preprocess goals
with open("goals.txt", "r") as file:
    raw_goals = file.readlines()

preprocessed_goals = [preprocess_goal(goal.strip()) for goal in raw_goals]

# Save the preprocessed goals to a new file
with open("preprocessed_goals.txt", "w") as file:
    for goal in preprocessed_goals:
        file.write(goal + "\n")