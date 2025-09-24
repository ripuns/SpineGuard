from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route("/calibrate/good", methods=["POST"])
def calibrate_good():
    try:
        # Run serial_reader.py with GOOD label
        subprocess.run(
            ["python", "script/serial_reader.py", "--label", "GOOD"],
            check=True
        )
        return jsonify({"status": "success", "message": "Calibrated GOOD posture"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/calibrate/bad", methods=["POST"])
def calibrate_bad():
    try:
        # Run serial_reader.py with BAD label
        subprocess.run(
            ["python", "script/serial_reader.py", "--label", "BAD"],
            check=True
        )
        return jsonify({"status": "success", "message": "Calibrated BAD posture"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/train", methods=["POST"])
def train_model():
    try:
        subprocess.run(
            ["python", "script/train_model.py"],
            check=True
        )
        return jsonify({"status": "success", "message": "Model trained successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
