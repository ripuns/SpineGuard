import glob
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

"""
Loads all *_samples_*.csv (from data_collector.py), computes derived features,
trains RandomForest, and saves a joblib pipeline that remembers feature names.
"""

BASE_FEATURES = ["ax", "ay", "az", "gx", "gy", "gz"]

def compute_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    # Derived features
    df["accel_mag"] = np.sqrt(df["ax"]**2 + df["ay"]**2 + df["az"]**2)
    df["gyro_mag"]  = np.sqrt(df["gx"]**2 + df["gy"]**2 + df["gz"]**2)
    df["tilt_angle"] = np.degrees(np.arctan2(np.sqrt(df["ax"]**2 + df["ay"]**2), df["az"]))
    return df

def load_all():
    files = sorted(glob.glob("*_samples_*.csv"))
    if not files:
        raise FileNotFoundError("No *_samples_*.csv files found. Run data_collector.py first.")
    dfs = []
    for f in files:
        df = pd.read_csv(f)
        if "label" not in df.columns:
            raise ValueError(f"{f} missing 'label' column")
        dfs.append(df)
    data = pd.concat(dfs, ignore_index=True)
    # Normalize label text
    data["label"] = data["label"].str.strip().str.lower()
    return data

def main():
    data = load_all()
    data = compute_features(data)

    feature_order = BASE_FEATURES + ["accel_mag", "gyro_mag", "tilt_angle"]
    X = data[feature_order]               # DataFrame (keeps feature names in model)
    y = data["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=300, max_depth=None, random_state=42, n_jobs=-1
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    print("\n=== Classification Report ===")
    print(classification_report(y_test, y_pred, digits=3))
    print("\n=== Confusion Matrix (rows=true, cols=pred) ===")
    print(confusion_matrix(y_test, y_pred))

    bundle = {
        "model": clf,
        "feature_order": feature_order,
    }
    out_path = os.path.join(os.getcwd(), "model.joblib")  # ⬅️ only this changed
    joblib.dump(clf, "model.joblib")
    print(f"\n✅ Saved model to {out_path}")

if __name__ == "__main__":
    main()
