import os
import ssl
import nltk

# Specify the download directory relative to the script location
nltk_data_dir = os.path.join(os.path.dirname(__file__), 'nltk_data')
nltk.data.path.append(nltk_data_dir)

# Create an unverified SSL context
ssl._create_default_https_context = ssl._create_unverified_context

# Download the 'punkt' tokenizer data
nltk.download('punkt', download_dir=nltk_data_dir)