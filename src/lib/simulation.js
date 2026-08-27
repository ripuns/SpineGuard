/**
 * SpineGuard Physiological Kinematic Simulation Engine
 */

import { SimulationScenario } from './types';

export class SimulationEngine {
  constructor() {
    this.currentScenario = SimulationScenario.HEALTHY_SITTING;
    this.scenarioStep = 0;
    this.scenarioTotalSteps = 30;
    this.isRunning = false;
    this.baseGravity = 9.80665;
  }

  setScenario(scenarioId) {
    this.currentScenario = scenarioId;
    this.scenarioStep = 0;
  }

  reset() {
    this.scenarioStep = 0;
  }

  _gaussianNoise(mean = 0, stdDev = 1) {
    const u1 = Math.max(1e-6, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  _angleToSensorReading(targetAngleDeg, lateralTiltDeg = 0, dynamicMotionLevel = 0.05) {
    const timeSec = this.scenarioStep * 0.5;
    const respirationOscillation = Math.sin(timeSec * 1.5) * 0.4;
    const effectiveAngle = targetAngleDeg + respirationOscillation;

    const rad = (effectiveAngle * Math.PI) / 180;
    const lateralRad = (lateralTiltDeg * Math.PI) / 180;

    const nominalAz = Math.cos(rad) * 1.0;
    const nominalAx = Math.sin(rad) * Math.cos(lateralRad) * 1.0;
    const nominalAy = Math.sin(lateralRad) * 1.0;

    const noiseAx = this._gaussianNoise(0, 0.015);
    const noiseAy = this._gaussianNoise(0, 0.012);
    const noiseAz = this._gaussianNoise(0, 0.015);

    const ax = Number((nominalAx + noiseAx).toFixed(4));
    const ay = Number((nominalAy + noiseAy).toFixed(4));
    const az = Number((nominalAz + noiseAz).toFixed(4));

    const gyroBase = dynamicMotionLevel * 10;
    const gx = Number(this._gaussianNoise(0, gyroBase + 0.3).toFixed(3));
    const gy = Number(this._gaussianNoise(0, gyroBase + 0.3).toFixed(3));
    const gz = Number(this._gaussianNoise(0, (gyroBase * 0.5) + 0.2).toFixed(3));

    return {
      ax,
      ay,
      az,
      gx,
      gy,
      gz,
      timestamp: new Date().toISOString(),
      step: this.scenarioStep,
      scenario: this.currentScenario,
    };
  }

  nextReading() {
    this.scenarioStep++;
    const step = this.scenarioStep;

    switch (this.currentScenario) {
      case SimulationScenario.HEALTHY_SITTING: {
        const microShift = Math.sin(step * 0.2) * 1.2;
        const angle = 79.5 + microShift;
        return this._angleToSensorReading(angle, 0.5, 0.03);
      }

      case SimulationScenario.GRADUAL_SLOUCH: {
        const maxSteps = 40;
        const progress = Math.min(1.0, step / maxSteps);
        const startAngle = 79.0;
        const endAngle = 60.5;
        const angle = startAngle - (progress * (startAngle - endAngle));
        const lateralDrift = progress * 2.5;
        return this._angleToSensorReading(angle, lateralDrift, 0.04);
      }

      case SimulationScenario.SEVERE_SLOUCH: {
        let angle;
        if (step <= 6) {
          angle = 78.0 - (step * 3.8);
        } else {
          angle = 54.0 + (Math.sin(step * 0.4) * 1.5);
        }
        return this._angleToSensorReading(angle, 4.0, 0.08);
      }

      case SimulationScenario.FORWARD_LEAN: {
        const angle = 65.0 + (Math.sin(step * 0.3) * 1.8);
        return this._angleToSensorReading(angle, -1.0, 0.05);
      }

      case SimulationScenario.RECOVERY: {
        const maxSteps = 25;
        const progress = Math.min(1.0, step / maxSteps);
        const startAngle = 60.5;
        const endAngle = 80.0;
        const angle = startAngle + (progress * (endAngle - startAngle));
        return this._angleToSensorReading(angle, 0.2, 0.06);
      }

      case SimulationScenario.LONG_SESSION: {
        let angle;
        if (step <= 15) {
          angle = 79.5 + (Math.sin(step * 0.3) * 0.8);
        } else if (step <= 30) {
          const p = (step - 15) / 15;
          angle = 79.5 - (p * 15.5);
        } else if (step <= 45) {
          angle = 60.0 + (Math.sin(step * 0.5) * 1.2);
        } else if (step <= 52) {
          const p = (step - 45) / 7;
          angle = 60.0 + (p * 19.5);
        } else {
          angle = 79.8 + (Math.sin(step * 0.2) * 0.6);
        }
        return this._angleToSensorReading(angle, 1.0, 0.04);
      }

      default:
        return this._angleToSensorReading(79.0, 0, 0.02);
    }
  }
}

