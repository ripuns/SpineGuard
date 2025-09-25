from flask import Flask, jsonify
import subprocess
import threading
import time
import os
import csv
import json
import queue
import re
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global variables for monitoring
monitoring_process = None
current_posture = "GOOD"
session_data = {"good": 0, "bad": 0}
posture_queue = queue.Queue()
last_monitor_error = None

@app.route("/calibrate/good", methods=["POST"])
def calibrate_good():
    try:
        # Run serial_reader.py with GOOD label
        subprocess.run(
            ["python", "serial_reader.py", "--label", "GOOD"],
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
            ["python", "serial_reader.py", "--label", "BAD"],
            check=True
        )
        return jsonify({"status": "success", "message": "Calibrated BAD posture"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/train", methods=["POST"])
def train_model():
    try:
        subprocess.run(
            ["python", "train_model.py"],
            check=True
        )
        return jsonify({"status": "success", "message": "Model trained successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/start-monitoring", methods=["POST"])
def start_monitoring():
    global monitoring_process, session_data, posture_queue, last_monitor_error
    try:
        # Reset session data
        session_data = {"good": 0, "bad": 0}
        last_monitor_error = None
        
        # Clear the queue
        while not posture_queue.empty():
            posture_queue.get()
        
        # Start the test.py script (or test_integration.py for testing)
        python_exec = sys.executable
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        monitoring_process = subprocess.Popen(
            [python_exec, "-u", "test.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            cwd=os.path.dirname(os.path.abspath(__file__)),  # Run from backend directory
            env=env,
        )
        # Start a thread to monitor the output
        threading.Thread(target=monitor_posture_output, daemon=True).start()
        threading.Thread(target=monitor_posture_errors, daemon=True).start()
        threading.Thread(target=monitor_process_lifecycle, daemon=True).start()
        
        return jsonify({"status": "success", "message": "Monitoring started"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/stop-monitoring", methods=["POST"])
def stop_monitoring():
    global monitoring_process
    try:
        if monitoring_process:
            monitoring_process.terminate()
            try:
                monitoring_process.wait(timeout=2)
            except Exception:
                pass
            monitoring_process = None
        return jsonify({"status": "success", "message": "Monitoring stopped"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/posture-status", methods=["GET"])
def get_posture_status():
    global current_posture, session_data, posture_queue, last_monitor_error
    
    # Check for new posture data from the queue
    try:
        while not posture_queue.empty():
            new_posture = posture_queue.get_nowait()
            if new_posture in ["GOOD", "BAD"]:
                current_posture = new_posture
                if new_posture == "GOOD":
                    session_data["good"] += 1
                else:
                    session_data["bad"] += 1
    except queue.Empty:
        pass
    
    response = {
        "status": "success",
        "posture": current_posture,
        "session_data": session_data,
    }
    if last_monitor_error:
        response["monitor_error"] = last_monitor_error
    return jsonify(response)

@app.route("/analytics", methods=["GET"])
def get_analytics():
    try:
        # Read from posture_log.csv if it exists
        csv_path = "posture_log.csv"
        if os.path.exists(csv_path):
            good_count = 0
            bad_count = 0
            
            with open(csv_path, 'r') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Check different possible column names for posture
                    posture_value = row.get('Prediction') or row.get('posture') or row.get('Posture')
                    if posture_value:
                        posture_value = posture_value.upper().strip()
                        if posture_value == 'GOOD':
                            good_count += 1
                        elif posture_value == 'BAD':
                            bad_count += 1
            
            total = good_count + bad_count
            percentage = (good_count / total * 100) if total > 0 else 0
            
            return jsonify({
                "status": "success",
                "data": {
                    "good": good_count,
                    "bad": bad_count,
                    "percentage": round(percentage, 1)
                }
            })
        else:
            # Return default data if no CSV exists
            return jsonify({
                "status": "success",
                "data": {
                    "good": 128,
                    "bad": 42,
                    "percentage": 75.3
                }
            })
    except Exception as e:
        print(f"Analytics error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

def monitor_posture_output():
    global current_posture, session_data, posture_queue
    if not monitoring_process:
        return
    
    try:
        for line in iter(monitoring_process.stdout.readline, ''):
            if line.strip():
                print(f"Test.py output: {line.strip()}")  # Debug output
                
                # Parse the output to determine posture
                # Looking for lines like: "📌 Posture: GOOD | 🧪 Features: ..."
                posture_match = re.search(r'Posture:\s+(\w+)', line)
                if posture_match:
                    detected_posture = posture_match.group(1).upper()
                    if detected_posture in ["GOOD", "BAD"]:
                        posture_queue.put(detected_posture)
                        print(f"Posture detected and queued: {detected_posture}")
                
                # Also check for simple GOOD/BAD in the line
                elif "GOOD" in line.upper() and "BAD" not in line.upper():
                    posture_queue.put("GOOD")
                    print("Posture detected and queued: GOOD")
                elif "BAD" in line.upper() and "GOOD" not in line.upper():
                    posture_queue.put("BAD")
                    print("Posture detected and queued: BAD")
                    
    except Exception as e:
        print(f"Error monitoring posture: {e}")

def monitor_posture_errors():
    if not monitoring_process:
        return
    try:
        for line in iter(monitoring_process.stderr.readline, ''):
            if line.strip():
                print(f"[test.py STDERR] {line.strip()}")
    except Exception as e:
        print(f"Error reading stderr: {e}")

def monitor_process_lifecycle():
    global last_monitor_error
    if not monitoring_process:
        return
    try:
        exit_code = monitoring_process.wait()
        # Drain any remaining output
        try:
            remaining_out = monitoring_process.stdout.read() or ""
            remaining_err = monitoring_process.stderr.read() or ""
        except Exception:
            remaining_out, remaining_err = "", ""
        msg = f"test.py exited with code {exit_code}."
        if remaining_out.strip():
            msg += f" stdout: {remaining_out.strip()}"
        if remaining_err.strip():
            msg += f" stderr: {remaining_err.strip()}"
        print(msg)
        last_monitor_error = msg
    except Exception as e:
        print(f"Error waiting for process: {e}")

if __name__ == "__main__":
    # Disable reloader to avoid killing child processes on file change
    app.run(debug=True, use_reloader=False, port=5000)
