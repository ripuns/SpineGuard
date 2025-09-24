# Import necessary libraries
import serial  # For serial communication with Arduino
import joblib  # For loading trained ML model
import numpy as np  # For numerical operations
from collections import deque  # For efficient fixed-size buffers
from colorama import Fore, Style  # For colored terminal output
import time  # For time-related operations
import math  # For math functions
import winsound # for beep on windows
import pandas as pd
import threading #for non blocking voice alerts
from pushbullet import Pushbullet
from datetime import datetime
import csv



# Initialize voice alert control variables
bad_counter = 0  # Counts consecutive bad postures
good_counter = 0  # To reset alert_triggered after enough good postures
trigger_limit = 20  # Voice alert triggers after this many bad readings
alert_triggered = False

# === PUSHBULLET SETUP ===
pb = Pushbullet("o.4pGo8D3BfKxNC046FhlAei2736vr1dYK")  # Replace with your token

# === CONFIGURATION ===
PORT = 'COM7'  # Change this to the correct COM port for your device
BAUD = 115200  # Baud rate for serial communication
MODEL_PATH = "model.joblib"  # Path to saved joblib model
TILT_THRESHOLD = 15  # Angle change threshold to switch to fast smoothing mode
FAST_MODE_SIZE = 2  # Buffer size when user moves a lot (fast prediction)
SLOW_MODE_SIZE = 4  # Buffer size when user is still (smooth prediction)
VOTE_BUFFER_SIZE = 3  # How many predictions to consider for majority vote


CSV_LOG_FILE = "posture_log.csv"

# Always overwrite on startup
with open(CSV_LOG_FILE, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow([
        "Timestamp", "ax", "ay", "az", "gx", "gy", "gz",
        "accel_mag", "gyro_mag", "tilt_angle", "Prediction"
    ])



# === LOAD THE MACHINE LEARNING MODEL ===
try:
    clf = joblib.load(MODEL_PATH)
    print(Fore.GREEN + f"✅ Loaded model from {MODEL_PATH}" + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f"❌ Model loading failed: {e}" + Style.RESET_ALL)
    exit(1)  # Exit if model can't be loaded

# === SETUP SERIAL CONNECTION ===
try:
    ser = serial.Serial(PORT, BAUD, timeout=1)
    print(Fore.GREEN + f"📡 Connected to {PORT} @ {BAUD} baud." + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f"❌ Serial connection failed: {e}" + Style.RESET_ALL)
    exit(1)  # Exit if serial connection fails

# === CREATE BUFFERS FOR SMOOTHING ===
feat_buffer = deque(maxlen=SLOW_MODE_SIZE)  # Buffer for features
vote_buffer = deque(maxlen=VOTE_BUFFER_SIZE)  # Buffer for smoothing predictions
prev_tilt = None  # Store previous tilt angle to detect changes

# Message to user to start posture tracking
print(Fore.YELLOW + "\n📊 Starting live prediction... Sit straight and observe...\n" + Style.RESET_ALL)
iter_count = 0  # Used to flush buffer periodically

last_log_time = time.time()
LOG_INTERVAL = 10  # 5 minutes in seconds

# === MAIN LOOP ===
while True:
    try:
        # Read a line from serial
        line = ser.readline().decode('utf-8').strip()

        # Skip header lines or empty lines
        if not line or 'ax' in line.lower():
            continue

        # Split comma-separated sensor data
        parts = line.split(',')
        if len(parts) != 7:
            continue  # Skip malformed data

        iter_count += 1
        if iter_count % 50 == 0:
            ser.flushInput()  # Flush old data every 50 readings

        # Unpack values and convert to float
        ts, ax, ay, az, gx, gy, gz = parts
        ax, ay, az = float(ax), float(ay), float(az)
        gx, gy, gz = float(gx), float(gy), float(gz)

        # === FUNCTION TO EXTRACT DERIVED FEATURES ===
        def extract_features(ax, ay, az, gx, gy, gz):
            accel_mag = np.sqrt(ax**2 + ay**2 + az**2)  # Acceleration magnitude
            gyro_mag = np.sqrt(gx**2 + gy**2 + gz**2)  # Gyroscope magnitude
            tilt_angle = np.degrees(np.arctan2(np.sqrt(ax**2 + ay**2), az))  # Tilt angle in degrees
            return [ax, ay, az, gx, gy, gz, accel_mag, gyro_mag, tilt_angle]

        # === TILT-BASED SMOOTHING CONTROL ===
        tilt_angle = math.degrees(math.acos(az / (math.sqrt(ax**2 + ay**2 + az**2) + 1e-6)))

        # Switch to fast buffer if user moves abruptly
        if prev_tilt is not None and abs(tilt_angle - prev_tilt) > TILT_THRESHOLD:
            feat_buffer = deque(list(feat_buffer), maxlen=FAST_MODE_SIZE)
        else:
            feat_buffer = deque(list(feat_buffer), maxlen=SLOW_MODE_SIZE)

        prev_tilt = tilt_angle  # Update tilt

        # Extract features and append to buffer
        feature = extract_features(ax, ay, az, gx, gy, gz)
        feat_buffer.append(feature)

        # Skip prediction if not enough samples yet
        if len(feat_buffer) < feat_buffer.maxlen:
            continue

        # === RUN PREDICTION ===
        smoothed_array = np.mean(feat_buffer, axis=0).reshape(1, -1)
        smoothed = pd.DataFrame(smoothed_array, columns=[
            "ax", "ay", "az", "gx", "gy", "gz", "accel_mag", "gyro_mag", "tilt_angle"
        ])
        pred = clf.predict(smoothed)[0]  # Predict posture

       # Log to CSV every 5 minutes
        current_time = time.time()
        if current_time - last_log_time >= LOG_INTERVAL:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            row = [timestamp] + [round(val, 3) for val in smoothed.iloc[0].tolist()] + [pred]
            with open(CSV_LOG_FILE, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(row)
            last_log_time = current_time

        # Add prediction to vote buffer
        vote_buffer.append(pred)

        # Determine final prediction by majority vote
        final = max(set(vote_buffer), key=vote_buffer.count)
        
        # === DISPLAY OUTPUT TO USER ===
        color = Fore.GREEN if final.upper() == "GOOD" else Fore.RED
        print(color + f"📌 Posture: {final.upper()} | 🧪 Features: {np.round(smoothed.iloc[0], 3).tolist()}" + Style.RESET_ALL)
        
        # NEW SNIPPET: write current posture to a file for sitting_timer.py
        with open("posture_state.txt", "w") as f:
            f.write(pred)  # prediction should be "GOOD", "BAD", or "STANDING"

        
        with open("posture_log.csv", "a", newline='') as f:
            writer = csv.writer(f)
            writer.writerow([datetime.now(), final.upper()])
            
        last_alert = None  # add at the top (global) near bad_counter

        # Inside the while loop after prediction
        if pred.lower() == "bad":
            bad_counter += 1
            good_counter = 0  # reset
            if bad_counter >= trigger_limit:
                winsound.Beep(1000, 500)
                if not alert_triggered:
                    last_alert = pb.push_note("⚠️ Bad Posture Alert", "Sit straight, your posture is incorrect.")
                    alert_triggered = True
                bad_counter = 0
        else:
            bad_counter = 0
            good_counter += 1
            if good_counter >= 5 and alert_triggered:
                pb.push_note("✅ Posture Corrected", "You are now sitting correctly.")
                alert_triggered = False



    except KeyboardInterrupt:
        # Exit gracefully on Ctrl+C
        print(Fore.CYAN + "\n👋 Exiting." + Style.RESET_ALL)
        break

    except Exception as e:
        # Catch any runtime errors during parsing or prediction
        print(Fore.YELLOW + f"⚠️ Parse/Prediction error: {e}" + Style.RESET_ALL)