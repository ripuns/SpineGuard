# SpineGuard: AI-Powered Posture Correction Assistant

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/SpineGuard)
[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)](https://nextjs.org/)

**A smart system that monitors your posture in real-time and provides feedback to help you build healthier habits.**

---

### TL;DR

- **What it is:** A hardware and software project to track and analyze your sitting posture using an Arduino and a machine learning model.
- **What it does:** Reads sensor data, classifies your posture (good/bad), and displays real-time feedback on a web dashboard.
- **How to run it:**
  ```bash
  # Terminal 1: Start the web server
  npm install
  npm run dev
  ```
  ```bash
  # Terminal 2: Start the posture detection script
  pip install -r requirements.txt
  python script/predict_live.py
  ```

---

## 1. Project Overview

### 1.1. Purpose and Motivation

In an era where many of us spend hours sitting at desks, poor posture has become a major health concern, leading to back pain, neck strain, and other musculoskeletal issues. **SpineGuard** is designed to be a non-intrusive, real-time posture coach. It actively monitors how you sit and provides gentle reminders and data-driven insights to help you maintain a healthy posture throughout the day.

The motivation behind this project is to leverage accessible technology (like Arduino and Raspberry Pi) and the power of machine learning to create a practical, affordable solution for a common health problem.

### 1.2. Target Users

- **Students and Professionals:** Anyone who spends long hours sitting at a computer.
- **Health-conscious Individuals:** People looking to improve their physical well-being and build better habits.
- **Hobbyists and Makers:** Electronics and software enthusiasts interested in a hands-on project that blends hardware, software, and AI.

### 1.3. Use Cases

- **Real-time Posture Correction:** Get immediate feedback on your posture via the web dashboard.
- **Habit Building:** Track your posture trends over time to see your improvement.
- **Ergonomic Assessment:** Use the data to help you adjust your chair, desk, and monitor setup for better ergonomics.

## 2. System Architecture

SpineGuard consists of three main components that work together: the hardware for data collection, a Python backend for data processing and machine learning, and a Next.js web application for the user interface.

```
      +-------------------+      +----------------------+      +--------------------+
      |  Arduino Nano     |      |  Python Backend      |      |  Next.js Frontend  |
      | (with Sensors)    |      | (on your computer)   |      | (Web Dashboard)    |
      +-------------------+      +----------------------+      +--------------------+
               |                          |                             |
               | (Serial Data)            |                             |
               +------------------------> | (Reads Serial Port)         |
                                          |                             |
                                          | 1. Reads & parses data      |
                                          | 2. Feeds data to ML model   |
                                          | 3. Model predicts posture   |
                                          | (good/bad)                  |
                                          |                             |
                                          | (WebSocket)                 |
                                          +---------------------------> | (Displays posture)
                                                                        |
```

### 2.1. Components

- **Hardware (`arduino.ino`):**
  - An Arduino (or similar microcontroller) is equipped with sensors (e.g., ultrasonic distance sensors, flex sensors) placed on a chair.
  - It continuously measures values that correlate with posture (e.g., distance from your back to the chair, spinal curve).
  - This data is sent to the host computer over a USB serial connection.

- **Python Scripts (`script/`):**
  - `serial_reader.py`: A script to connect to the Arduino's serial port, read the incoming data, and save it (useful for collecting a training dataset).
  - `train_model.py`: This script takes a labeled dataset of posture data (e.g., `posture_data.csv`) and trains a machine learning model (e.g., a simple neural network or a classical model like SVM) to classify posture as "good" or "bad". It saves the trained model to a file (e.g., `posture_model.h5`).
  - `predict_live.py`: The main backend script. It reads live data from the Arduino, uses the pre-trained model to predict the current posture in real-time, and sends the prediction to the web dashboard via WebSockets.
  - `posture_graph.py`: A utility to visualize the collected posture data.

- **Web Dashboard (`src/app/`):**
  - A Next.js application that serves as the user-facing dashboard.
  - It connects to the Python backend via WebSockets to receive live posture status.
  - It displays the current posture (e.g., with a changing icon or color), historical data, and tips for improvement.

## 3. System Requirements

- **Operating System:** Windows, macOS, or Linux.
- **Python:** Version 3.9 or newer.
- **Node.js:** Version 18.0 or newer.
- **Hardware:**
  - Arduino or a compatible microcontroller.
  - Necessary sensors (e.g., 3x HC-SR04 ultrasonic sensors).
  - Breadboard and jumper wires.
- **Software:**
  - Arduino IDE or PlatformIO to upload the `.ino` sketch.

## 4. Installation and Setup

Follow these steps to get the project running.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/SpineGuard.git
cd SpineGuard
```

### Step 2: Setup the Hardware

1.  Assemble the Arduino and sensors on your chair. A common setup involves placing one sensor at the top of the chair, one in the middle (lumbar region), and one on the seat.
2.  Connect the Arduino to your computer via USB.
3.  Open `script/arduino.ino` in the Arduino IDE.
4.  Select the correct board and port.
5.  Upload the sketch to the Arduino.

### Step 3: Setup the Python Backend

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2.  **Install Python dependencies:**
    A `requirements.txt` file is recommended. If it doesn't exist, you'll need to install the libraries manually.
    ```bash
    # Create this file if it doesn't exist
    # requirements.txt
    # numpy
    # pandas
    # pyserial
    # scikit-learn
    # tensorflow
    # websockets

    pip install -r requirements.txt
    ```

### Step 4: Setup the Frontend

1.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

## 5. Usage

To run the application, you need to start both the backend and frontend processes.

### Terminal 1: Start the Frontend

```bash
npm run dev
```

This will start the Next.js development server, typically at `http://localhost:3000`. Open this URL in your browser.

### Terminal 2: Start the Backend

```bash
python script/predict_live.py
```

This script will automatically try to connect to the Arduino, start classifying your posture, and send data to the web dashboard. Sit in your chair, and you should see the dashboard update in real-time.

## 6. Code Structure

```
.
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── script/
│   ├── arduino.ino         # Arduino code for sensor reading
│   ├── posture_graph.py    # Utility for visualizing data
│   ├── predict_live.py     # Main script for live posture prediction
│   ├── serial_reader.py    # Script to collect training data
│   ├── sit.py              # (Likely a helper or test script)
│   ├── test.py             # (General purpose test script)
│   └── train_model.py      # Script to train the ML model
└── src/
    └── app/
        ├── globals.css     # Global styles for the web app
        ├── layout.js       # Next.js main layout
        └── page.js         # The main page of the web dashboard
```

## 7. Troubleshooting

- **Error: `serial.serialutil.SerialException: could not open port 'COM3'`**
  - **Cause:** The Python script cannot find the Arduino.
  - **Fix:**
    1.  Make sure the Arduino is plugged in.
    2.  Check the Arduino IDE to see which port it's connected to (e.g., `COM4`, `/dev/ttyUSB0`).
    3.  Update the port name in `predict_live.py` and `serial_reader.py`.

- **Web dashboard shows "Disconnected"**
  - **Cause:** The frontend cannot connect to the backend's WebSocket server.
  - **Fix:**
    1.  Ensure `predict_live.py` is running without errors.
    2.  Check that the WebSocket URL in `src/app/page.js` matches the one in the Python script (e.g., `ws://localhost:8765`).
    3.  Check your firewall settings to ensure it's not blocking the connection.

## 8. Contribution Guidelines

We welcome contributions! Please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`.
3.  **Make your changes.** Adhere to the existing code style.
4.  **Submit a pull request** with a clear description of your changes.

---

## 9. FAQ

**Q: What kind of sensors should I use?**
**A:** The project is designed for ultrasonic distance sensors (like the HC-SR04) because they are cheap and effective. However, you could adapt it to use flex sensors, pressure sensors, or even a camera.

**Q: How do I collect my own training data?**
**A:**
1.  Run `python script/serial_reader.py`.
2.  Sit in a "good" posture for a few minutes, then a "bad" posture.
3.  The script will save the data to a `.csv` file.
4.  Use this labeled data to run `train_model.py`.
5.  Now user can successfully get their posture alignment.

---

## 10. Contact

For questions or support, please open an issue on GitHub.
