# SpineGuard Frontend Architecture (`src/`)

## What
The `src/` directory encapsulates the complete frontend engineering and client-side data pipeline for SpineGuard, built with Next.js 15, React 19, Tailwind CSS v4, and modern Web APIs.

## Why
SpineGuard separates its presentation and client-side ingestion logic from physical transport mechanisms. This directory provides the user-facing web dashboard, interactive testing studio, dynamic SVG biomechanical visualizer, and the unified sensor data abstraction layer.

## Structure
```
src/
├── app/                  # Next.js App Router pages and routes
│   ├── analytics/        # Session metrics and ergonomic trends
│   ├── dashboard/        # Real-time posture intelligence console
│   ├── posturepred/      # Interactive studio & live telemetry monitor
│   ├── settings/         # System sensitivity & audio synthesizer settings
│   ├── signup/           # User registration flow
│   ├── globals.css       # Global styles and Tailwind animations
│   ├── layout.js         # Root HTML layout and global navigation
│   └── page.js           # Public landing page & system overview
├── components/           # Reusable presentation and interactive components
│   ├── CalibrationModal.jsx        # 3-step guided reference calibration
│   ├── DataSourceSelector.jsx      # Hardware vs Simulation switcher
│   ├── HardwareArchitectureViewer.jsx # 6-layer hardware schematic
│   ├── HardwareVideoDemo.jsx       # Test protocol & demonstration container
│   ├── Navbar.jsx                  # Scroll-reactive navigation header
│   ├── ProfileDropdown.jsx         # User account menu & session handling
│   ├── RawTelemetryInspector.jsx   # 6-DOF developer table & JSON inspector
│   ├── ScenarioRunner.jsx          # Interactive scenario execution controller
│   ├── SpineVisualizer.jsx         # Real-time dynamic SVG spine curvature
│   └── SystemStatusWidget.jsx      # Operational telemetry and health widget
└── lib/                  # Core algorithms, domain models & client pipeline
    ├── dataSource.js     # SensorDataSource abstraction (Hardware + Sim)
    ├── pipeline.js       # Unified mathematical feature extraction & classifier
    ├── simulation.js     # Physiological kinematic simulation engine
    ├── soundAlerts.js    # Web Audio API alert synthesizer
    ├── supabaseClient.js # Supabase client with build-time fallback
    └── types.js          # Enums, constants, and scenario definitions
```

## How to Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

## Overall Summary
The `src/` directory represents the entire client-facing interface and edge processing layer of SpineGuard, delivering rich real-time visual feedback, transparent data-source switching, and thorough observability.

