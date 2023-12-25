from flask import Flask

app = Flask(__name__)

# Configuration
API_URL = '/api'    # path to the `api` folder, relative to next.js root folder

# Routes
@app.route(f'{API_URL}/')
def home():
    return 'Hello, World!'
