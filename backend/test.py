from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/data', methods=['GET'])
def get_data():
    data = pd.read_csv("frontend_data.csv")
    # print(data)
    return jsonify(data.to_dict(orient='records'))

@app.route('/leftdata', methods=['GET'])
def get_other_data():
    other_data = pd.read_csv("leftlive.csv")
    return jsonify(other_data.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(port=3001)


