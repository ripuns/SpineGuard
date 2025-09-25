#!/usr/bin/env python3
"""
Test script to verify backend integration with test.py
This simulates the posture monitoring without requiring Arduino hardware
"""

import time
import random
import csv
from datetime import datetime

def simulate_posture_data():
    """Simulate posture data similar to what test.py would output"""
    
    # Create a CSV file with simulated data
    csv_file = "posture_log.csv"
    
    # Clear existing file
    with open(csv_file, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            "Timestamp", "ax", "ay", "az", "gx", "gy", "gz",
            "accel_mag", "gyro_mag", "tilt_angle", "Prediction"
        ])
    
    print("🧪 Simulating posture monitoring...")
    print("📌 Posture: GOOD | 🧪 Features: [0.1, 0.2, 9.8, 0.0, 0.0, 0.0, 9.8, 0.0, 10.0]")
    
    # Simulate some posture changes
    postures = ["GOOD", "BAD", "GOOD", "GOOD", "BAD", "GOOD", "BAD", "GOOD", "GOOD", "GOOD"]
    
    for i, posture in enumerate(postures):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Simulate sensor data
        if posture == "GOOD":
            ax, ay, az = 0.1, 0.2, 9.8
            gx, gy, gz = 0.0, 0.0, 0.0
        else:  # BAD
            ax, ay, az = 2.0, 1.5, 8.5
            gx, gy, gz = 0.5, 0.3, 0.1
        
        accel_mag = (ax**2 + ay**2 + az**2)**0.5
        gyro_mag = (gx**2 + gy**2 + gz**2)**0.5
        tilt_angle = 10.0 if posture == "GOOD" else 25.0
        
        # Write to CSV
        with open(csv_file, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                timestamp, ax, ay, az, gx, gy, gz,
                accel_mag, gyro_mag, tilt_angle, posture
            ])
        
        # Print to stdout (simulating test.py output)
        color = "\033[92m" if posture == "GOOD" else "\033[91m"  # Green or Red
        reset = "\033[0m"
        print(f"{color}📌 Posture: {posture} | 🧪 Features: [{ax:.1f}, {ay:.1f}, {az:.1f}, {gx:.1f}, {gy:.1f}, {gz:.1f}, {accel_mag:.1f}, {gyro_mag:.1f}, {tilt_angle:.1f}]{reset}")
        
        time.sleep(2)  # Wait 2 seconds between readings
    
    print("\n✅ Simulation complete! Check posture_log.csv for data.")

if __name__ == "__main__":
    simulate_posture_data()
