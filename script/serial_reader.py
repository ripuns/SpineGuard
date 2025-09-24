import argparse
import csv
import os
import time
from datetime import datetime

import serial

"""
Collect labeled samples from Arduino/MPU6050 and save to CSV.

Expected serial line: either "ax,ay,az,gx,gy,gz" OR "ts,ax,ay,az,gx,gy,gz"
We robustly parse both and take the last 6 numeric values as ax..gz.
"""

def parse_line_to_features(line: str):
    """Return [ax, ay, az, gx, gy, gz] or None."""
    parts = [p.strip() for p in line.split(",")]
    nums = []
    for p in parts:
        try:
            nums.append(float(p))
        except ValueError:
            # ignore non-numeric cells (headers, timestamps)
            pass
    if len(nums) >= 6:
        return nums[-6:]  # last six nums = ax..gz
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", default="COM7", help="Serial port (e.g., COM7 or /dev/ttyUSB0)")
    ap.add_argument("--baud", type=int, default=115200, help="Baud rate")
    ap.add_argument("--label", choices=["GOOD", "BAD", "good", "bad"], required=True, help="Posture label")
    ap.add_argument("--samples", type=int, default=200, help="number of samples to collect")
    args = ap.parse_args()

    label = args.label.upper()
    fname = f"{label.lower()}_samples_.csv"
    path = os.path.join(os.getcwd(), fname)

    print(f"🔌 Opening {args.port} @ {args.baud} …")
    try:
        ser = serial.Serial(args.port, args.baud, timeout=1)
        time.sleep(2)  # allow port to settle
    except serial.SerialException as e:
        print(f"❌ Serial error: {e}")
        return

    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["ax", "ay", "az", "gx", "gy", "gz", "label"])
        count = 0
        print(f"▶️  Collecting {args.samples} samples labeled {label} … Sit/pose accordingly.")
        while count < args.samples:
            try:
                line = ser.readline().decode("utf-8", errors="ignore").strip()
                if not line or "ax" in line.lower():
                    continue
                feats = parse_line_to_features(line)
                if feats:
                    w.writerow([*feats, label])
                    count += 1
                    if count % 10 == 0:
                        print(f"  [{count}/{args.samples}]  ax={feats[0]:.3f} ay={feats[1]:.3f} az={feats[2]:.3f}")
            except Exception as e:
                print("⚠️  Parse error:", e)

    ser.close()
    print(f"✅ Saved {args.samples} samples to {path}")

if __name__ == "__main__":
    main()
