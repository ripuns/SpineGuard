import serial
import joblib
import numpy as np
from collections import deque
from colorama import Fore, Style
import time
import math
import pyttsx3
import pandas as pd

# === CONFIG ===
PORT = 'COM7'  # Change to your port
BAUD = 115200
MODEL_PATH = "model.joblib"
TILT_THRESHOLD = 15  # Degree change that triggers fast mode
FAST_MODE_SIZE = 2
SLOW_MODE_SIZE = 4
VOTE_BUFFER_SIZE = 3

# === LOAD MODEL ===
try:
    clf = joblib.load(MODEL_PATH)
    print(Fore.GREEN + f"✅ Loaded model from {MODEL_PATH}" + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f"❌ Model loading failed: {e}" + Style.RESET_ALL)
    exit(1)

# === SERIAL INIT ===
try:
    ser = serial.Serial(PORT, BAUD, timeout=1)
    print(Fore.GREEN + f"📡 Connected to {PORT} @ {BAUD} baud." + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f"❌ Serial connection failed: {e}" + Style.RESET_ALL)
    exit(1)

# === BUFFERS ===
feat_buffer = deque(maxlen=SLOW_MODE_SIZE)
vote_buffer = deque(maxlen=VOTE_BUFFER_SIZE)
prev_tilt = None

print(Fore.YELLOW + "\n📊 Starting live prediction... Sit straight and observe...\n" + Style.RESET_ALL)
iter_count = 0


# === LOOP ===
while True:
    try:
        line = ser.readline().decode('utf-8').strip()
        if not line or 'ax' in line.lower():
            continue

        parts = line.split(',')
        if len(parts) != 7:
            continue

        iter_count += 1
        if iter_count % 50 == 0:
            ser.flushInput()
        ts, ax, ay, az, gx, gy, gz = parts
        ax, ay, az = float(ax), float(ay), float(az)
        gx, gy, gz = float(gx), float(gy), float(gz)

        def extract_features(ax, ay, az, gx, gy, gz):
            accel_mag = np.sqrt(ax**2 + ay**2 + az**2)
            gyro_mag = np.sqrt(gx**2 + gy**2 + gz**2)
            tilt_angle = np.degrees(np.arctan2(np.sqrt(ax**2 + ay**2), az))

            return [ax, ay, az, gx, gy, gz, accel_mag, gyro_mag, tilt_angle]
        # === Calculate tilt ===
        tilt_angle = math.degrees(math.acos(az / (math.sqrt(ax**2 + ay**2 + az**2) + 1e-6)))

        # === Adjust smoothing dynamically ===
        if prev_tilt is not None and abs(tilt_angle - prev_tilt) > TILT_THRESHOLD:
            feat_buffer = deque(list(feat_buffer), maxlen=FAST_MODE_SIZE)
        else:
            feat_buffer = deque(list(feat_buffer), maxlen=SLOW_MODE_SIZE)

        prev_tilt = tilt_angle

        # === Feature Vector ===
        feature = extract_features(ax, ay, az, gx, gy, gz)
        feat_buffer.append(feature)

        if len(feat_buffer) < feat_buffer.maxlen:
            continue

        smoothed_array = np.mean(feat_buffer, axis=0).reshape(1, -1)
        smoothed = pd.DataFrame(smoothed_array, columns=[
            "ax", "ay", "az", "gx", "gy", "gz", "accel_mag", "gyro_mag", "tilt_angle"
        ])
        pred = clf.predict(smoothed)[0]

        vote_buffer.append(pred)
        final = max(set(vote_buffer), key=vote_buffer.count)

        # === OUTPUT ===
        color = Fore.GREEN if final.upper() == "GOOD" else Fore.RED
        print(color + f"📌 Posture: {final.upper()} | 🧪 Features: {np.round(smoothed.iloc[0], 3).tolist()}" + Style.RESET_ALL)


    except KeyboardInterrupt:
        print(Fore.CYAN + "\n👋 Exiting." + Style.RESET_ALL)
        break
    except Exception as e:
        import traceback
        print(Fore.YELLOW + f"⚠️ Parse/Prediction error: {type(e).__name__} - {e}" + Style.RESET_ALL)
        traceback.print_exc()
