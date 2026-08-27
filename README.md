# SpineGuard — Real-Time Posture Intelligence System

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

SpineGuard is an end-to-end IoT and software engineering platform that monitors sitting posture in real time using 6-DOF inertial measurement unit (IMU) telemetry, applies biomechanical feature extraction and machine learning classification, and delivers instantaneous multimodal ergonomic feedback.

---

## 1. System Overview & Core Principle

SpineGuard is built on the core architectural foundation:

> **Hardware is a Data Source. The System is the Product. Simulation is the Access Mechanism.**

The application supports two interchangeable data sources:
1. **Live Hardware Mode**: Direct serial ingestion of 6-DOF IMU data (`ax, ay, az, gx, gy, gz`) from an MPU-6050 accelerometer/gyroscope on Arduino/ESP32 via USB serial or BLE.
2. **Simulation Mode**: A physiological kinematic simulation engine generating time-series biomechanical movement profiles with Gaussian sensor noise, breathing micro-oscillations, and realistic posture transitions.

Both sources pass through the exact same downstream feature extraction, classification, dynamic filtering, hysteresis, alert engine, and analytics pipeline.

```
                 DATA SOURCE
                /           \
               /             \
       REAL HARDWARE       SIMULATOR
            │                  │
            └────────┬─────────┘
                     ▼
              SAME DATA PIPELINE
                     │
                     ▼
              DATA PROCESSING
                     │
                     ▼
             POSTURE ANALYSIS
                     │
                     ▼
                ALERT ENGINE
                     │
                     ▼
                  BACKEND
                     │
              ┌──────┴──────┐
              ▼             ▼
         DASHBOARD       ANALYTICS
```

---

## 2. Interactive Scenarios

SpineGuard includes 6 realistic physiological kinematic scenarios for review and testing without physical hardware:

- **Healthy Sitting**: Stable optimal posture (78°–82° spinal angle) with natural micro-movements.
- **Gradual Slouch**: Realistic progressive spinal degradation (79° down to 60° over time).
- **Severe Slouch**: Rapid abrupt slouch (54°–60°) with continuous alert triggering.
- **Forward Lean**: Anterior spinal tilt and screen hunching with compensatory cervical strain.
- **Postural Recovery**: Ergonomic self-correction and thoracic repositioning (61° back up to 80°).
- **Long Session**: Comprehensive 60-step multi-phase timeline displaying healthy work, gradual fatigue, warning thresholds, alert dispatch, and posture correction.

---

## 3. System Architecture & Tech Stack

### Web Application (`src/`)
- **Framework**: Next.js 15 (App Router, Turbopack) & React 19
- **Styling**: Tailwind CSS v4 with glassmorphic dark UI
- **Visualization**: 10-node dynamic SVG biomechanical spine curvature model
- **Audio Feedback**: Web Audio API oscillator synthesis (warning tones, poor posture pulses, recovery chimes)
- **State Management**: Reactive data source pub/sub manager (`spineGuardData`)

### Python Backend & Microcontroller Layer (`backend/`)
- **Backend API**: Python Flask REST API (`backend/app.py`) with Flask-CORS
- **Firmware**: Arduino C++ sketch (`backend/arduino.ino`) for MPU-6050 over I2C at 400kHz
- **Machine Learning**: Scikit-learn `RandomForestClassifier` pipeline with derived features (`accel_mag`, `gyro_mag`, `tilt_angle`, `spine_tilt`, `pitch`, `roll`)
- **Alert Dispatch**: Windows beep + Pushbullet mobile push notifications + onboard piezobuzzer

---

## 4. Hardware Wiring & Pinout (MPU-6050 to Arduino Nano)

| MPU-6050 Pin | Arduino Nano Pin | Function |
| :--- | :--- | :--- |
| **VCC** | **5V / 3.3V** | Power Supply |
| **GND** | **GND** | Ground |
| **SCL** | **A5 (SCL)** | I2C Clock Line (400 kHz) |
| **SDA** | **A4 (SDA)** | I2C Data Line |
| **INT** | **D2 (Optional)** | Motion Interrupt |
| **Buzzer (+)** | **D8** | Piezoelectric Acoustic Alert |

---

## 5. Getting Started & Installation

### Option A: Running the Web Application (Interactive Studio & Simulation)
```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev

# 3. Open browser at http://localhost:3000
```

### Option B: Running Full-Stack with Python Backend & Hardware
```bash
# Terminal 1: Start Next.js frontend
npm run dev

# Terminal 2: Start Python Flask backend
cd backend
pip install flask flask-cors pyserial scikit-learn pandas numpy joblib
python app.py
```

---

## 6. Repository File Structure

```
.
├── backend/                  # Python Flask server, ML models, and Arduino firmware
│   ├── app.py                # REST API endpoints & monitoring daemon
│   ├── arduino.ino           # MPU-6050 I2C sensor driver for Arduino
│   ├── predict_live.py       # Live serial predictor
│   ├── serial_reader.py      # Labeled calibration data collector
│   ├── test.py               # Live hardware pipeline with pushbullet alerts
│   ├── test_integration.py   # Subprocess integration test
│   ├── train_model.py        # Random Forest model trainer
│   └── README.md             # Backend architecture documentation
├── public/                   # Static assets and SVG icons
├── src/                      # Next.js web application
│   ├── app/                  # App Router pages (/dashboard, /posturepred, /analytics, /settings)
│   │   ├── analytics/        # Session analytics & trend curves
│   │   ├── dashboard/        # Main posture intelligence console
│   │   ├── posturepred/      # Live monitor & interactive studio
│   │   ├── settings/         # System configuration & audio testing
│   │   └── page.js           # Public landing page & overview
│   ├── components/           # UI presentation & visualization components
│   │   ├── CalibrationModal.jsx        # 3-step guided reference calibration
│   │   ├── DataSourceSelector.jsx      # Hardware vs Simulation switcher
│   │   ├── HardwareArchitectureViewer.jsx # 6-layer hardware schematic
│   │   ├── HardwareVideoDemo.jsx       # Test protocol showcase container
│   │   ├── RawTelemetryInspector.jsx   # 6-DOF developer table & JSON inspector
│   │   ├── ScenarioRunner.jsx          # Interactive scenario controller
│   │   ├── SpineVisualizer.jsx         # Dynamic SVG spine curvature model
│   │   └── SystemStatusWidget.jsx      # System observability metrics
│   └── lib/                  # Core domain models & data pipeline
│       ├── dataSource.js     # Unified SensorDataSource abstraction
│       ├── pipeline.js       # Mathematical feature extraction & classifier
│       ├── simulation.js     # Kinematic simulation engine
│       ├── soundAlerts.js    # Web Audio API alert synthesizer
│       ├── supabaseClient.js # Supabase client with build-time fallback
│       └── types.js          # Constants, enums, and scenario definitions
├── package.json
└── README.md
```

---

## 7. Quality Standards & Ethical Engineering
- **Zero Fabricated Results**: Model accuracy, precision, recall, and scientific outcomes are never simulated or fabricated. All displayed metrics represent real computed angles and live sensor readings.
- **Data Provenance**: Simulation telemetry is clearly marked with active source badges and never misrepresented as physical hardware readings.
- **Continuous Documentation**: Every substantive directory maintains an updated `README.md` detailing What, Why, How, and Overall Role.
