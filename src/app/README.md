# SpineGuard Web Application Routing & Pages (`src/app/`)

## What
This directory contains the Next.js 15 App Router page routes, global layout wrappers, and stylesheet definitions for SpineGuard.

## Why
SpineGuard delivers an interactive web experience that enables visitors, reviewers, and interviewers to explore the entire IoT pipeline without requiring physical microcontroller connections, while preserving full hardware-driven functionality when running in local environments.

## How
The routes in this folder are organized as follows:
- **`layout.js`**: Defines the root HTML shell, typography fonts (Geist & Geist Mono), navigation bar (`Navbar.jsx`), user profile controls, and global toast wrappers.
- **`globals.css`**: Tailwind CSS v4 styling rules, custom scrollbar behaviors, pulse keyframe animations, and slider range styling.
- **`page.js` (`/`)**: Public landing page featuring SpineGuard's IoT mission, interactive call-to-actions, the 5-step engineering signal chain explainer, hardware architecture diagrams, test video showcase, and user login authentication.
- **`dashboard/page.jsx` (`/dashboard`)**: The main posture intelligence console displaying live posture score percentage, good posture compliance %, current spinal angle gauges, 10-node dynamic SVG spine visualizer, guided calibration modal trigger, and data source switcher.
- **`posturepred/page.jsx` (`/posturepred`)**: Interactive testing studio and live monitor allowing reviewers to trigger and step through all 6 simulation scenarios (Healthy Sitting, Gradual Slouch, Severe Slouch, Forward Lean, Recovery, Long Session) or stream live hardware serial data, with real-time 6-DOF feature breakdown, developer telemetry table inspector, and system observability metrics.
- **`analytics/page.jsx` (`/analytics`)**: Historical and session telemetry analysis presenting posture compliance curves, good vs warning vs bad distribution bars, longest unbroken upright streaks, total alert counts, and ergonomic corrective guidelines.
- **`settings/page.jsx` (`/settings`)**: System configuration interface with functional threshold controls, telemetry sampling rate selectors, Web Audio API tone test synthesizers, and persistent local storage synchronization.
- **`signup/page.jsx` (`/signup`)**: Supabase user account creation form.

## Overall Summary
`src/app/` coordinates SpineGuard's frontend presentation layer, delivering a coherent and responsive user experience across desktop and mobile viewports.

