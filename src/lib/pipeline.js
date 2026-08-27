/**
 * SpineGuard Unified Posture Processing Pipeline
 */

import { PostureState } from './types';

export class PosturePipeline {
  constructor(config = {}) {
    this.tiltThreshold = config.tiltThreshold || 15.0;
    this.fastBufferSize = config.fastBufferSize || 2;
    this.slowBufferSize = config.slowBufferSize || 4;
    this.voteBufferSize = config.voteBufferSize || 3;
    this.baselineAngle = config.baselineAngle || 78.5;
    this.warningThreshold = config.warningThreshold || 74.0;
    this.badThreshold = config.badThreshold || 68.0;

    this.featureBuffer = [];
    this.voteBuffer = [];
    this.prevTilt = null;
    
    this.currentBufferSize = this.slowBufferSize;
    this.lastProcessedReading = null;
    this.goodStreak = 0;
    this.badStreak = 0;
    this.warningStreak = 0;
    this.longestGoodStreak = 0;
    this.totalReadings = 0;
    this.goodReadingsCount = 0;
    this.badReadingsCount = 0;
    this.warningReadingsCount = 0;
  }

  setCalibration(baselineAngle) {
    if (typeof baselineAngle === 'number' && baselineAngle > 40 && baselineAngle < 100) {
      this.baselineAngle = baselineAngle;
      this.warningThreshold = baselineAngle - 4.5;
      this.badThreshold = baselineAngle - 10.5;
    }
  }

  reset() {
    this.featureBuffer = [];
    this.voteBuffer = [];
    this.prevTilt = null;
    this.goodStreak = 0;
    this.badStreak = 0;
    this.warningStreak = 0;
    this.longestGoodStreak = 0;
    this.totalReadings = 0;
    this.goodReadingsCount = 0;
    this.badReadingsCount = 0;
    this.warningReadingsCount = 0;
    this.lastProcessedReading = null;
  }

  processReading(raw) {
    const ax = Number(raw.ax) || 0;
    const ay = Number(raw.ay) || 0;
    const az = Number(raw.az) || 0;
    const gx = Number(raw.gx) || 0;
    const gy = Number(raw.gy) || 0;
    const gz = Number(raw.gz) || 0;
    const timestamp = raw.timestamp || new Date().toISOString();

    const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);
    const gyroMag = Math.sqrt(gx * gx + gy * gy + gz * gz);
    
    const normAz = az / (accelMag + 1e-6);
    const clampedAz = Math.max(-1.0, Math.min(1.0, normAz));
    const tiltAngle = (Math.acos(clampedAz) * 180) / Math.PI;

    const spineTilt = (Math.atan2(Math.sqrt(ax * ax + ay * ay), az + 1e-6) * 180) / Math.PI;
    const pitch = (Math.atan2(ax, Math.sqrt(ay * ay + az * az) + 1e-6) * 180) / Math.PI;
    const roll = (Math.atan2(ay, Math.sqrt(ax * ax + az * az) + 1e-6) * 180) / Math.PI;

    if (this.prevTilt !== null && Math.abs(tiltAngle - this.prevTilt) > this.tiltThreshold) {
      this.currentBufferSize = this.fastBufferSize;
    } else {
      this.currentBufferSize = this.slowBufferSize;
    }
    this.prevTilt = tiltAngle;

    const featureVector = [ax, ay, az, gx, gy, gz, accelMag, gyroMag, tiltAngle, spineTilt, pitch, roll];
    this.featureBuffer.push(featureVector);
    while (this.featureBuffer.length > this.currentBufferSize) {
      this.featureBuffer.shift();
    }

    const numFeatures = featureVector.length;
    const smoothed = new Array(numFeatures).fill(0);
    for (const fv of this.featureBuffer) {
      for (let i = 0; i < numFeatures; i++) {
        smoothed[i] += fv[i] / this.featureBuffer.length;
      }
    }

    const smoothedTiltAngle = smoothed[8];
    const smoothedSpineTilt = smoothed[9];
    const smoothedPitch = smoothed[10];
    const smoothedRoll = smoothed[11];

    const angleDelta = Math.abs(smoothedTiltAngle - this.baselineAngle);
    let instantaneousState = PostureState.GOOD;

    if (smoothedTiltAngle < this.badThreshold || angleDelta > 14.0 || Math.abs(smoothedRoll) > 18.0) {
      instantaneousState = PostureState.BAD;
    } else if (smoothedTiltAngle < this.warningThreshold || angleDelta > 6.0 || Math.abs(smoothedRoll) > 10.0) {
      instantaneousState = PostureState.WARNING;
    } else {
      instantaneousState = PostureState.GOOD;
    }

    this.voteBuffer.push(instantaneousState);
    while (this.voteBuffer.length > this.voteBufferSize) {
      this.voteBuffer.shift();
    }

    const counts = { [PostureState.GOOD]: 0, [PostureState.WARNING]: 0, [PostureState.BAD]: 0 };
    for (const v of this.voteBuffer) {
      counts[v] = (counts[v] || 0) + 1;
    }
    let classifiedState = PostureState.GOOD;
    let maxVote = -1;
    for (const [state, count] of Object.entries(counts)) {
      if (count > maxVote) {
        maxVote = count;
        classifiedState = state;
      }
    }

    const rawPenalty = (angleDelta * 3.5) + (Math.abs(smoothedRoll) * 1.5) + (gyroMag * 2.0);
    const postureScore = Math.max(10, Math.min(100, Math.round(100 - rawPenalty)));

    const stabilityFactor = Math.max(0, 1.0 - Math.min(1.0, gyroMag / 25.0));
    const confidence = Math.min(99, Math.max(82, Math.round(92 + (stabilityFactor * 7))));

    this.totalReadings++;
    if (classifiedState === PostureState.GOOD) {
      this.goodReadingsCount++;
      this.goodStreak++;
      this.badStreak = 0;
      this.warningStreak = 0;
      if (this.goodStreak > this.longestGoodStreak) {
        this.longestGoodStreak = this.goodStreak;
      }
    } else if (classifiedState === PostureState.WARNING) {
      this.warningReadingsCount++;
      this.warningStreak++;
      this.badStreak = 0;
      this.goodStreak = 0;
    } else {
      this.badReadingsCount++;
      this.badStreak++;
      this.goodStreak = 0;
      this.warningStreak = 0;
    }

    const goodPosturePercentage = this.totalReadings > 0
      ? Number(((this.goodReadingsCount / this.totalReadings) * 100).toFixed(1))
      : 100;

    const result = {
      timestamp,
      raw: { ax, ay, az, gx, gy, gz },
      features: {
        accelMag: Number(accelMag.toFixed(3)),
        gyroMag: Number(gyroMag.toFixed(3)),
        tiltAngle: Number(smoothedTiltAngle.toFixed(1)),
        spineTilt: Number(smoothedSpineTilt.toFixed(1)),
        pitch: Number(smoothedPitch.toFixed(1)),
        roll: Number(smoothedRoll.toFixed(1)),
      },
      classification: {
        state: classifiedState,
        instantaneousState,
        postureScore,
        confidence,
        baselineAngle: this.baselineAngle,
        angleDelta: Number(angleDelta.toFixed(1)),
      },
      stats: {
        totalReadings: this.totalReadings,
        goodCount: this.goodReadingsCount,
        warningCount: this.warningReadingsCount,
        badCount: this.badReadingsCount,
        goodPosturePercentage,
        goodStreak: this.goodStreak,
        badStreak: this.badStreak,
        warningStreak: this.warningStreak,
        longestGoodStreak: this.longestGoodStreak,
      },
    };

    this.lastProcessedReading = result;
    return result;
  }
}

