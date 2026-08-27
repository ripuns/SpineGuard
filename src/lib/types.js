/**
 * SpineGuard Core Data Structures and Constants
 */

export const PostureState = {
  GOOD: 'GOOD',
  WARNING: 'WARNING',
  BAD: 'BAD',
};

export const DataSourceMode = {
  SIMULATION: 'SIMULATION',
  HARDWARE: 'HARDWARE',
};

export const SimulationScenario = {
  HEALTHY_SITTING: 'HEALTHY_SITTING',
  GRADUAL_SLOUCH: 'GRADUAL_SLOUCH',
  SEVERE_SLOUCH: 'SEVERE_SLOUCH',
  FORWARD_LEAN: 'FORWARD_LEAN',
  RECOVERY: 'RECOVERY',
  LONG_SESSION: 'LONG_SESSION',
};

export const SCENARIO_METADATA = {
  [SimulationScenario.HEALTHY_SITTING]: {
    id: SimulationScenario.HEALTHY_SITTING,
    label: 'Healthy Sitting',
    description: 'Stable optimal posture (78°–82° spinal angle) with natural physiological micromovements.',
    durationSeconds: 30,
    targetAngleRange: [78, 82],
    expectedState: PostureState.GOOD,
  },
  [SimulationScenario.GRADUAL_SLOUCH]: {
    id: SimulationScenario.GRADUAL_SLOUCH,
    label: 'Gradual Slouch',
    description: 'Realistic progressive spinal posture degradation from 79° down to 60° over time.',
    durationSeconds: 40,
    targetAngleRange: [60, 79],
    expectedState: PostureState.BAD,
  },
  [SimulationScenario.SEVERE_SLOUCH]: {
    id: SimulationScenario.SEVERE_SLOUCH,
    label: 'Severe Slouch',
    description: 'Rapid abrupt transition into severe slouch (54°–60°) with continuous alert triggering.',
    durationSeconds: 25,
    targetAngleRange: [52, 60],
    expectedState: PostureState.BAD,
  },
  [SimulationScenario.FORWARD_LEAN]: {
    id: SimulationScenario.FORWARD_LEAN,
    label: 'Forward Lean',
    description: 'Anterior spinal tilt and screen hunching with compensatory cervical strain.',
    durationSeconds: 30,
    targetAngleRange: [62, 68],
    expectedState: PostureState.WARNING,
  },
  [SimulationScenario.RECOVERY]: {
    id: SimulationScenario.RECOVERY,
    label: 'Postural Recovery',
    description: 'Ergonomic self-correction and thoracic repositioning from 61° back up to 80°.',
    durationSeconds: 25,
    targetAngleRange: [61, 80],
    expectedState: PostureState.GOOD,
  },
  [SimulationScenario.LONG_SESSION]: {
    id: SimulationScenario.LONG_SESSION,
    label: 'Long Session (Fatigue Curve)',
    description: 'Comprehensive multi-phase session showing healthy work, gradual fatigue, warning, alert, and correction.',
    durationSeconds: 60,
    targetAngleRange: [56, 82],
    expectedState: 'DYNAMIC',
  },
};

export const DEFAULT_CALIBRATION = {
  baselineAngle: 78.5,
  calibratedAt: null,
  samplesCount: 50,
  pitchOffset: 0.0,
  rollOffset: 0.0,
};

export const DEFAULT_SYSTEM_SETTINGS = {
  postureThreshold: 72.0,
  warningThreshold: 75.0,
  alertDelaySeconds: 5,
  samplingIntervalMs: 1000,
  soundAlerts: true,
  pushNotifications: false,
  dataSource: DataSourceMode.SIMULATION,
};

