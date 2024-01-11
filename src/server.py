from flask import Flask

PORT = 5000
app = Flask(__name__)

def start_server():
    app.run(port=PORT, threaded=True, host='0.0.0.0')

@app.route('/', methods=['get'])
def main_page():
    return open("src/index.html", "r").read()

@app.route('/style.css', methods=['get'])
def css():
    return open("src/style.css", "r").read()

@app.route('/chart-min.js', methods=['get'])
def script():
    return open("src/chart-min.js", "r").read()

if __name__ == "__main__":
    start_server()
