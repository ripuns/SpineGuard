import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv("posture_log.csv")

# Convert timestamp column
df['Timestamp'] = pd.to_datetime(df['Timestamp'])

# Replace posture with numeric: GOOD=0, BAD=1
df['Posture'] = df['Prediction'].map({'GOOD': 0, 'BAD': 1})

# Plot
plt.figure(figsize=(12, 5))
plt.plot(df['Timestamp'], df['Posture'], marker='o', linestyle='-')
plt.yticks([0, 1], ['GOOD', 'BAD'])
plt.xlabel("Time")
plt.ylabel("Posture")
plt.title("Posture Over Time (Logged Every 5 Minutes)")
plt.grid(True)
plt.tight_layout()
plt.show()
