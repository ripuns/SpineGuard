/**
 * SpineGuard Data Source Manager & Abstraction Layer
 */

import { DataSourceMode, SimulationScenario, PostureState } from './types';
import { PosturePipeline } from './pipeline';
import { SimulationEngine } from './simulation';
import { soundAlerts } from './soundAlerts';

class SpineGuardDataManager {
  constructor() {
    this.mode = DataSourceMode.SIMULATION;
    this.pipeline = new PosturePipeline();
    this.simulationEngine = new SimulationEngine();
    
    this.activeScenario = SimulationScenario.HEALTHY_SITTING;
    this.isStreaming = false;
    this.timerId = null;
    this.samplingIntervalMs = 1000;
    this.listeners = new Set();
    this.rawTelemetryHistory = [];
    this.maxHistorySize = 50;

    this.hardwareApiUrl = 'http://localhost:5000';
    this.hardwareConnected = false;
    this.hardwareError = null;
    this.packetsReceived = 0;
    this.startTime = null;

    this.lastState = PostureState.GOOD;
    this.alertTriggered = false;
  }

  setMode(mode) {
    if (mode !== this.mode) {
      const wasStreaming = this.isStreaming;
      if (wasStreaming) this.stop();
      this.mode = mode;
      this.pipeline.reset();
      this.rawTelemetryHistory = [];
      this.packetsReceived = 0;
      if (wasStreaming) this.start();
    }
  }

  setScenario(scenarioId) {
    this.activeScenario = scenarioId;
    this.simulationEngine.setScenario(scenarioId);
  }

  setSamplingInterval(ms) {
    this.samplingIntervalMs = Math.max(200, Math.min(5000, ms));
    if (this.isStreaming) {
      this.stop();
      this.start();
    }
  }

  setCalibration(baselineAngle) {
    this.pipeline.setCalibration(baselineAngle);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  _notifyListeners(payload) {
    for (const listener of this.listeners) {
      try {
        listener(payload);
      } catch (e) {
        console.error('Error in telemetry listener:', e);
      }
    }
  }

  start() {
    if (this.isStreaming) return;
    this.isStreaming = true;
    this.startTime = Date.now();

    if (this.mode === DataSourceMode.SIMULATION) {
      this.simulationEngine.reset();
      this.timerId = setInterval(() => {
        this._tickSimulation();
      }, this.samplingIntervalMs);
      this._tickSimulation();
    } else {
      this._startHardwareMonitoring();
      this.timerId = setInterval(() => {
        this._pollHardwareStatus();
      }, this.samplingIntervalMs);
    }
  }

  stop() {
    this.isStreaming = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.mode === DataSourceMode.HARDWARE) {
      this._stopHardwareMonitoring();
    }
  }

  _tickSimulation() {
    const rawReading = this.simulationEngine.nextReading();
    const processed = this.pipeline.processReading(rawReading);
    this.packetsReceived++;

    this._handleAlertTransitions(processed.classification.state);

    this.rawTelemetryHistory.unshift(processed);
    if (this.rawTelemetryHistory.length > this.maxHistorySize) {
      this.rawTelemetryHistory.pop();
    }

    const payload = {
      source: DataSourceMode.SIMULATION,
      scenario: this.activeScenario,
      processed,
      history: this.rawTelemetryHistory,
      system: {
        isStreaming: true,
        packetsProcessed: this.packetsReceived,
        samplingIntervalMs: this.samplingIntervalMs,
        uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
        hardwareStatus: 'SIMULATION_ACTIVE',
      },
    };

    this._notifyListeners(payload);
  }

  async _startHardwareMonitoring() {
    try {
      const res = await fetch(`${this.hardwareApiUrl}/start-monitoring`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        this.hardwareConnected = true;
        this.hardwareError = null;
      } else {
        this.hardwareConnected = false;
        this.hardwareError = data.message || 'Failed to initialize hardware monitoring.';
      }
    } catch (e) {
      this.hardwareConnected = false;
      this.hardwareError = 'Cannot reach Python Flask backend (port 5000). Ensure backend is running.';
    }
  }

  async _pollHardwareStatus() {
    try {
      const res = await fetch(`${this.hardwareApiUrl}/posture-status`);
      const data = await res.json();
      if (data.status === 'success') {
        this.hardwareConnected = true;
        this.hardwareError = null;
        
        const isGood = data.posture === 'GOOD';
        const targetAngle = isGood ? 78.5 : 62.0;
        const rad = (targetAngle * Math.PI) / 180;
        const rawReading = {
          ax: Number((Math.sin(rad) * 1.0).toFixed(4)),
          ay: 0.05,
          az: Number((Math.cos(rad) * 1.0).toFixed(4)),
          gx: 0.01,
          gy: 0.01,
          gz: 0.01,
          timestamp: new Date().toISOString(),
        };

        const processed = this.pipeline.processReading(rawReading);
        this.packetsReceived++;

        this._handleAlertTransitions(processed.classification.state);

        this.rawTelemetryHistory.unshift(processed);
        if (this.rawTelemetryHistory.length > this.maxHistorySize) {
          this.rawTelemetryHistory.pop();
        }

        const payload = {
          source: DataSourceMode.HARDWARE,
          scenario: null,
          processed,
          history: this.rawTelemetryHistory,
          backendSessionData: data.session_data,
          system: {
            isStreaming: true,
            packetsProcessed: this.packetsReceived,
            samplingIntervalMs: this.samplingIntervalMs,
            uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
            hardwareStatus: 'CONNECTED',
          },
        };

        this._notifyListeners(payload);
      }
    } catch (e) {
      this.hardwareConnected = false;
      this.hardwareError = 'Hardware link dropped or Flask backend unreachable.';
      this._notifyListeners({
        source: DataSourceMode.HARDWARE,
        error: this.hardwareError,
        system: {
          isStreaming: false,
          hardwareStatus: 'DISCONNECTED',
        },
      });
    }
  }

  async _stopHardwareMonitoring() {
    try {
      await fetch(`${this.hardwareApiUrl}/stop-monitoring`, { method: 'POST' });
    } catch (e) {
      // ignore
    }
  }

  _handleAlertTransitions(currentState) {
    if (currentState === PostureState.BAD && this.lastState !== PostureState.BAD) {
      soundAlerts.playBadPostureTone();
      this.alertTriggered = true;
    } else if (currentState === PostureState.WARNING && this.lastState === PostureState.GOOD) {
      soundAlerts.playWarningTone();
    } else if (currentState === PostureState.GOOD && this.lastState === PostureState.BAD && this.alertTriggered) {
      soundAlerts.playCorrectionChime();
      this.alertTriggered = false;
    }
    this.lastState = currentState;
  }
}

export const spineGuardData = new SpineGuardDataManager();

