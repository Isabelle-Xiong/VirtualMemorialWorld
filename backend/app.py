from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

# Load the pre-trained Sentence-BERT model
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/similarity', methods=['POST'])
def calculate_similarity():
    data = request.json
    sentence1 = data['sentence1']
    sentence2 = data['sentence2']

    # Compute embeddings
    embeddings1 = model.encode(sentence1, convert_to_tensor=True)
    embeddings2 = model.encode(sentence2, convert_to_tensor=True)

    # Compute cosine similarity
    similarity_score = util.pytorch_cos_sim(embeddings1, embeddings2).item()

    return jsonify({'similarity': similarity_score})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
