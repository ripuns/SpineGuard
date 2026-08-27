# SpineGuard Python Backend & Microcontroller Firmware (`backend/`)

## What
This directory contains the Python Flask REST API server, serial hardware ingestion worker, machine learning training scripts, Arduino/ESP32 firmware (`arduino.ino`), and sitting timer utilities for the physical SpineGuard hardware.

## Why
While SpineGuard provides an interactive kinematic simulation engine inside the web runtime, the `backend/` enables physical hardware deployment. It interfaces directly with the MPU-6050 6-DOF IMU, executes on-host machine learning inference via Scikit-Learn pipelines, and exposes REST endpoints for calibration and live monitoring.

## File Breakdown
- **`app.py`**: Flask REST API server (port 5000) managing the monitoring worker process, posture queue, CSV analytics aggregation, and `/health`, `/start-monitoring`, `/stop-monitoring`, `/posture-status`, `/calibrate/good`, `/calibrate/bad`, and `/train` endpoints.
- **`arduino.ino`**: Arduino sketch interfacing with the MPU-6050 via I2C (Wire library) at 400kHz. Normalizes 16-bit register values to `g` and `°/s`, executes on-board buzzer alerts upon slouching, and streams CSV packets (`ts,ax,ay,az,gx,gy,gz`) at 115200 baud over USB serial.
- **`serial_reader.py`**: Calibration and dataset collector script that reads live serial lines from `COM7` and saves labeled samples (`good_samples_*.csv` or `bad_samples_*.csv`).
- **`train_model.py`**: Machine learning training script that computes derived features (`accel_mag`, `gyro_mag`, `tilt_angle`), trains a `RandomForestClassifier` (300 estimators), and exports `model.joblib`.
- **`test.py`**: Primary live hardware monitoring daemon. Ingests serial stream, computes derived kinematic features, applies dynamic 2/4-frame jitter smoothing, predicts posture via `model.joblib`, applies majority voting, logs to `posture_log.csv`, and triggers Windows beep + Pushbullet notifications upon sustained slouching.
- **`test_integration.py`**: Hardware-free verification script used to test backend subprocess communications and CSV output.
- **`posture_graph.py`**: Matplotlib utility to visualize logged posture events over time.
- **`sit.py`**: Background sedentary timer generating desktop notifications and text-to-speech stretch reminders after prolonged sitting.

## How to Run Backend
```bash
# Install Python requirements
pip install flask flask-cors pyserial scikit-learn pandas numpy joblib

# Start Flask API server
python backend/app.py
```

## Overall Summary
`backend/` provides the bridge between the physical microcontroller/sensor layer and the web application, handling low-level serial communication, machine learning model lifecycle, and native system alerts.

