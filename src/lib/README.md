# SpineGuard Core Library (`src/lib/`)

## What
This directory houses the foundational domain models, data source abstractions, signal processing algorithms, kinematic simulation generator, audio synthesizer, and cloud client integration for SpineGuard.

## Why
SpineGuard operates under the fundamental architectural tenet that **Hardware is a Data Source, and the System is the Product**. To enable seamless evaluation by interviewers, clinical assessors, and developers without physical MPU6050 microcontrollers, all business logic, feature engineering, classification routines, and alert rules must be decoupled from the raw transport mechanism and shared identically across both live hardware streams and simulated kinematic telemetry.

## How
The modules in this folder collaborate as follows:
- **`types.js`**: Declares immutable enums (`PostureState`, `DataSourceMode`, `SimulationScenario`), scenario metadata, baseline calibration shapes, and default system settings.
- **`pipeline.js` (`PosturePipeline`)**: Ingests raw 6-DOF IMU data (`ax, ay, az, gx, gy, gz`), extracts derived spatial metrics (tilt angle, sagittal pitch, lateral roll, total acceleration magnitude, and gyroscope angular velocity), manages dynamic jitter buffers (fast vs slow mode), calculates majority-voted posture states (`GOOD`, `WARNING`, `BAD`), posture scores (0–100%), biomechanical confidence levels (82–99%), and tracks uninterrupted streaks.
- **`simulation.js` (`SimulationEngine`)**: Generates physiological time-series sensor readings with Box-Muller Gaussian noise, natural respiration oscillations (~0.25 Hz), and realistic movement dynamics across 6 predefined scenarios (Healthy Sitting, Gradual Slouch, Severe Slouch, Forward Lean, Recovery, Long Session).
- **`dataSource.js` (`spineGuardData`)**: Provides a unified subscription interface (`subscribe`, `start`, `stop`, `setMode`, `setScenario`, `setCalibration`) that switches transparently between `SimulationDataSource` and `HardwareDataSource` (communicating with the Flask backend on port 5000).
- **`soundAlerts.js` (`soundAlerts`)**: Generates gentle synthesized acoustic feedback (warning tones, poor posture buzzes, correction chimes) using the Web Audio API without requiring external audio assets.
- **`supabaseClient.js`**: Initializes the Supabase database and authentication client with build-time fallbacks to guarantee fault-tolerant static generation.

## Overall Summary
`src/lib/` forms the central nervous system of SpineGuard's web layer, ensuring that whether a telemetry packet originates from an Arduino Nano over USB serial or from the physiological kinematic simulator, it undergoes identical mathematical feature extraction, classification, and event triggering.

